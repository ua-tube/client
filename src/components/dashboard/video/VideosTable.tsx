import { IDashboardVideosResponse, IPagination, IVideo } from '@/interfaces'
import { FC, useEffect, useMemo, useState } from 'react'
import { VideoManagerService } from '@/services'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
	getDashboardVideoUrl,
	getImageUrl,
	getVideoUrl,
	toastError
} from '@/utils'
import {
	ColumnDef,
	ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
	VisibilityState
} from '@tanstack/react-table'
import {
	Button,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DynamicIcon,
	Input,
	Progress,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components'

const getVideoColumns = (
	updateData: () => Promise<void>
): ColumnDef<IVideo>[] => [
	{
		id: 'title',
		accessorKey: 'title',
		header: () => 'Відео',
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
		cell: ({ row: { original } }) => {
			return (
				<div className='flex flex-row items-center space-x-3 pt-1'>
					<div className='h-24 aspect-video rounded-lg'>
						<img
							src={getImageUrl(
								original.thumbnails?.find(
									v => v.imageFileId === original.thumbnailId
								)?.url
							)}
							alt={original.id}
							className='size-full object-cover rounded-lg'
						/>
					</div>
					<div className='relative max-w-lg'>
						<p
							children={original.title}
							className='line-clamp-1 opacity-100 group-hover:opacity-0'
						/>
						<span
							className='text-sm line-clamp-2 text-muted-foreground opacity-100 group-hover:opacity-0'
							children={original.description?.slice(0, 120)}
						/>
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
					return 'Публічне'
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
		cell: ({ row: { original } }) =>
			new Date(original.createdAt || '').toLocaleString()
	},
	{
		id: 'updatedAt',
		accessorKey: 'updatedAt',
		filterFn: 'auto',
		header: () => 'Дата оновлення',
		cell: ({ row: { original } }) =>
			new Date(original.updatedAt || '').toLocaleString()
	},
	{
		id: 'metrics.viewsCount',
		accessorKey: 'metrics',
		filterFn: 'auto',
		header: () => 'Перегляди',
		cell: ({
			row: {
				original: { metrics }
			}
		}) => metrics?.viewsCount
	},
	{
		id: 'metrics.commentsCount',
		accessorKey: 'metrics',
		filterFn: 'auto',
		header: () => 'Коментарі',
		cell: ({
			row: {
				original: { metrics }
			}
		}) => metrics?.commentsCount
	},
	{
		id: 'metrics.likesCount',
		accessorKey: 'likesCount',
		filterFn: 'auto',
		header: () => 'Уподобання',
		cell: ({
			row: {
				original: { metrics }
			}
		}) => {
			const percent =
				Math.floor(
					(+(metrics?.likesCount || 0) /
						(+(metrics?.likesCount || 0) + +(metrics?.dislikesCount || 0))) *
						100
				) || 0
			return (
				<Tooltip>
					<TooltipTrigger>
						<div className='flex flex-col space-y-1'>
							<div className='text-lg' children={`${percent}%`} />
							<span
								children={`${metrics?.likesCount || 0} оцінок "подобається"`}
							/>
							<Progress value={percent} className='h-1.5' />
						</div>
					</TooltipTrigger>
					<TooltipContent className='flex flex-row space-x-2'>
						<div className='flex items-center space-x-2'>
							<DynamicIcon name='thumbs-up' className='size-4' />
							<span children={metrics?.likesCount || 0} />
						</div>
						<div className='flex items-center space-x-2'>
							<DynamicIcon name='thumbs-down' className='size-4' />
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
		cell: ({ row: { original } }) => {
			const onDelete = async () => {
				try {
					await VideoManagerService.deleteVideo(original.id)
					await updateData()
				} catch (e) {
					toastError(e)
				}
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='ghost' className='size-8 p-0'>
							<span className='sr-only'>Відкрити меню</span>
							<DynamicIcon name='more-horizontal' className='size-4' />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end'>
						<DropdownMenuItem asChild>
							<Link

								href={getDashboardVideoUrl(original.id, 'edit')}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='pen' />
								<span>Редагувати відео</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link

								href={getDashboardVideoUrl(original.id, 'comments')}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='message-square-more' />
								<span>Перейти до коментарів</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								target='_blank'
								href={getVideoUrl(original.id, undefined, undefined, true)}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='play' />
								<span>Переглянути відео</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className='flex items-center gap-x-2 justify-start px-2'
							onClick={onDelete}
						>
							<DynamicIcon className='size-4' name='trash' />
							<span>Видалити відео</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]

const VideosTable: FC = () => {
	const { query } = useRouter()
	const [params, setParams] = useState<IPagination>({
		page: '1',
		perPage: '20'
	})

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
		<div className='w-full'>
			<div className='flex items-center py-4'>
				<Input
					placeholder='Фільтрувати за заголовком ...'
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					onChange={event =>
						table.getColumn('email')?.setFilterValue(event.target.value)
					}
					className='max-w-sm'
				/>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant='outline' className='ml-auto'>
							Колонки{' '}
							<DynamicIcon name='chevron-down' className='ml-2 h-4 w-4' />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						{table
							.getAllColumns()
							.filter(column => column.getCanHide())
							.map(column => (
								<DropdownMenuCheckboxItem
									key={column.id}
									className='capitalize'
									checked={column.getIsVisible()}
									onCheckedChange={value => column.toggleVisibility(value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map(headerGroup => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<TableHead key={header.id}>
										{!header.isPlaceholder &&
											flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map(row => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
								>
									{row.getVisibleCells().map(cell => (
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
									className='h-24 text-center'
								>
									Нічого не знайдено!
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						Previous
					</Button>
					<Button
						variant='outline'
						size='sm'
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
