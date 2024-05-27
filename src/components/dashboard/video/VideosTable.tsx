import { getDashboardVideoUrl, getVideoUrl, getImageUrl, toastError } from '@/utils'
import { IVideo, IDashboardVideosResponse, IPagination } from '@/interfaces'
import { VideoManagerService } from '@/services'
import { useState, FC, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
	SortingState,
	ColumnFiltersState,
	VisibilityState
} from '@tanstack/react-table'
import {
	DynamicIcon,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	Progress,
	Button,
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
	buttonVariants,
	Input,
	DropdownMenuCheckboxItem
} from '@/components'
import { useRouter } from 'next/router'


const getVideoColumns = (updateData: () => Promise<void>): ColumnDef<IVideo>[] => [
	{
		id: 'title',
		accessorKey: 'title',
		header: () => 'Відео',
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
		cell: ({ row: { original } }) => {
			return (
				<div className="group flex flex-row items-center space-x-3 pt-1">
					<div className="h-20 aspect-video rounded-lg">
						<img
							src={getImageUrl(original.thumbnails?.find(v => v.imageFileId === original.thumbnailId)?.url)}
							alt={original.id}
							className="size-full object-cover"
						/>
					</div>
					<div className="relative max-w-lg">
						<p
							children={original.title}
							className="line-clamp-1 opacity-100 group-hover:opacity-0"
						/>
						<span
							className="text-sm line-clamp-2 text-muted-foreground opacity-100 group-hover:opacity-0"
							children={original.description?.slice(0, 120)}
						/>
						<div
							className="absolute left-0 top-0 size-full opacity-0 group-hover:opacity-100 flex items-center space-x-4">
							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={getDashboardVideoUrl(original.id, 'edit')}
										className="hover:bg-muted rounded-full p-2.5"
									>
										<DynamicIcon name="pen" className="size-5" />
									</Link>
								</TooltipTrigger>
								<TooltipContent children="Редагувати відео" />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={getDashboardVideoUrl(original.id, 'comments')}
										className="hover:bg-muted rounded-full p-2.5"
									>
										<DynamicIcon name="message-square-more" className="size-5" />
									</Link>
								</TooltipTrigger>
								<TooltipContent children="Перейти до коментарів" />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										target="_blank"
										href={getVideoUrl(original.id, undefined, undefined, true)}
										className="hover:bg-muted rounded-full p-2.5"
									>
										<DynamicIcon name="play" className="size-5" />
									</Link>
								</TooltipTrigger>
								<TooltipContent children="Переглянути відео на UaTube" />
							</Tooltip>
						</div>
					</div>
				</div>
			)
		}
	},
	{
		id: 'visibility',
		header: () => 'Видимість',
		accessorKey: 'visibility',
		cell: ({ row: { original } }) => {
			switch (original.visibility) {
				case 'Private':
					return 'Приватне'
				case 'Unlisted':
					return 'Не для всіх'
				case 'Public':
					return 'Для всіх'
				default:
					return 'Приватне'
			}
		}
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		filterFn: 'auto',
		header: () => 'Дата створення',
		cell: ({ row: { original } }) => new Date(original.createdAt || '').toLocaleString()
	},
	{
		id: 'updatedAt',
		accessorKey: 'updatedAt',
		filterFn: 'auto',
		header: () => 'Дата оновлення',
		cell: ({ row: { original } }) => new Date(original.updatedAt || '').toLocaleString()
	},
	{
		id: 'metrics.viewsCount',
		accessorKey: 'metrics',
		filterFn: 'auto',
		header: () => 'Перегляди',
		cell: ({ row: { original: { metrics } } }) => metrics?.viewsCount
	},
	{
		id: 'metrics.commentsCount',
		accessorKey: 'metrics',
		filterFn: 'auto',
		header: () => 'Коментарі',
		cell: ({ row: { original: { metrics } } }) => metrics?.commentsCount
	},
	{
		id: 'metrics.likesCount',
		accessorKey: 'likesCount',
		filterFn: 'auto',
		header: () => 'Уподобання',
		cell: ({ row: { original: { metrics } } }) => {
			const percent =
				Math.floor(
					((+(metrics?.likesCount || 0)) /
						((+(metrics?.likesCount || 0)) + (+(metrics?.dislikesCount || 0)))) *
					100
				) || 0
			return (
				<Tooltip>
					<TooltipTrigger>
						<div className="flex flex-col space-y-1">
							<div className="text-lg" children={`${percent}%`} />
							<span
								children={`${metrics?.likesCount || 0} оцінок "подобається"`}
							/>
							<Progress value={percent} className="h-1.5" />
						</div>
					</TooltipTrigger>
					<TooltipContent className="flex flex-row space-x-2">
						<div className="flex items-center space-x-2">
							<DynamicIcon name="thumbs-up" className="size-4" />
							<span children={metrics?.likesCount || 0} />
						</div>
						<div className="flex items-center space-x-2">
							<DynamicIcon name="thumbs-down" className="size-4" />
							<span children={metrics?.dislikesCount || 0} />
						</div>
					</TooltipContent>
				</Tooltip>
			)
		}
	},
	{
		id: 'actions',
		enableHiding: false,
		header: () => 'Дії',
		cell: ({ row }) => {

			const onDelete = async () => {
				try {
					await VideoManagerService.deleteVideo(row.original.id)
					await updateData()
				} catch (e) {
					toastError(e)
				}
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Відкрити меню</span>
							<DynamicIcon name="more-horizontal" className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel className="text-center">Дії</DropdownMenuLabel>
						<DropdownMenuItem
							className={buttonVariants({ variant: 'destructive' })}
							onClick={onDelete}
						>
							Видалити відео
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]


const VideosTable: FC = () => {
	const { query } = useRouter()
	const [params, setParams] = useState<IPagination>({ page: '1', perPage: '20' })

	const [videosData, setVideosData] = useState<IDashboardVideosResponse>({
		list: [],
		pagination: { page: 1, pageCount: 1, pageSize: 1, total: 0 }
	})

	const updateData = async (p?: IPagination) => {
		try {
			const { data } = await VideoManagerService.getVideos(p || params)
			setVideosData(data)
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		;(async () => updateData())()
	}, [params, query])

	const columns = getVideoColumns(updateData)

	const [sorting, setSorting] = useState<SortingState>([])
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = useState({})

	const table = useReactTable({
		data: useMemo(() => videosData.list, [videosData.list]),
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection
		}
	})

	return (
		<div className="w-full">
			<div className="flex items-center py-4">
				<Input
					placeholder="Ві"
					value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className="max-w-sm"
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" className="ml-auto">
							Колонуи <DynamicIcon name="chevron-down" className="ml-2 h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						{table
							.getAllColumns()
							.filter((column) => column.getCanHide())
							.map((column) => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
										<TableHead key={header.id}>
											{!header.isPlaceholder && flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</TableHead>
									)
								)}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									Нічого не знайдено!
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className="flex items-center justify-end space-x-2 py-4">
				<div className="flex-1 text-sm text-muted-foreground">
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className="space-x-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						Next
					</Button>
				</div>
			</div>
		</div>
	)

}

export default VideosTable