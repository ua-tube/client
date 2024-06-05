import { FC, useEffect, useMemo, useState } from 'react'
import { VideoManagerService } from '@/services'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
	getStudioVideoUrl,
	getImageUrl,
	getVideoUrl,
	toastError
} from '@/utils'
import {
	IStudioVideosResponse,
	IPagination,
	IVideo,
	UseState
} from '@/interfaces'
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

const VideoUploadModal = dynamic(
	() => import('@/components/layouts/studio/videosModal')
)

const getVideoColumns = (
	updateData: () => Promise<void>,
	setVideo: UseState<IVideo | undefined>,
	t: (s: string) => string
): ColumnDef<IVideo>[] => [
	{
		id: 'title',
		accessorKey: 'title',
		header: () => t('video'),
		filterFn: (row, id, value) =>
			value
				.toLowerCase()
				.includes(row.getValue(row.original.title.toLowerCase())),
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
		header: () => t('visibility.title'),
		accessorKey: 'visibility',
		cell: ({ row: { original } }) => {
			switch (original.visibility) {
				case 'Private':
					return t('visibility.private')
				case 'Unlisted':
					return t('visibility.unlisted')
				case 'Public':
					return t('visibility.public')
				default:
					return t('visibility.private')
			}
		}
	},
	{
		id: 'status',
		header: () => '',
		accessorKey: 'visibility',
		cell: ({ row: { original } }) => {
			switch (original.processingStatus) {
				case 'WaitingForUserUpload':
					return (
						<Button onClick={() => setVideo(original)}>
							{t('status.uploadVideo')}
						</Button>
					)
				case 'VideoProcessed':
					return t('status.VideoProcessed')
				case 'VideoUploaded':
					return t('status.VideoUploaded')
				case 'VideoProcessingFailed':
					return t('status.VideoProcessingFailed')
				case 'VideoBeingProcessed':
					return t('status.VideoBeingProcessed')
				default:
					return t('status.unknownStatus')
			}
		}
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		filterFn: 'auto',
		header: () => t('createdAt'),
		cell: ({ row: { original } }) =>
			new Date(original.createdAt || '').toLocaleString()
	},
	{
		id: 'updatedAt',
		accessorKey: 'updatedAt',
		filterFn: 'auto',
		header: () => t('updatedAt'),
		cell: ({ row: { original } }) =>
			new Date(original.updatedAt || '').toLocaleString()
	},
	{
		id: 'Метрики',
		accessorKey: 'metrics',
		filterFn: 'auto',
		header: () => 'Метрики',
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
								children={`${metrics?.likesCount || 0} ${t('likesCount')}`}
							/>
							<Progress value={percent} className='h-1.5 w-24' />
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
						<div className='flex items-center space-x-2'>
							<DynamicIcon name='eye' className='size-4' />
							<span children={metrics?.viewsCount || 0} />
						</div>
						<div className='flex items-center space-x-2'>
							<DynamicIcon name='message-square-more' className='size-4' />
							<span children={metrics?.commentsCount || 0} />
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
							<DynamicIcon name='more-horizontal' className='size-4' />
						</Button>
					</DropdownMenuTrigger>

					<DropdownMenuContent align='end'>
						<DropdownMenuItem asChild>
							<Link
								href={getStudioVideoUrl(original.id, 'edit')}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='pen' />
								<span>{t('tableVideo.edit')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={getStudioVideoUrl(original.id, 'comments')}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='message-square-more' />
								<span>{t('tableVideo.comments')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								target='_blank'
								href={getVideoUrl(original.id, undefined, undefined, true)}
								className='hover:bg-muted rounded-full p-1 flex items-center gap-x-2'
							>
								<DynamicIcon className='size-4' name='play' />
								<span>{t('tableVideo.view')}</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className='flex items-center gap-x-2 justify-start px-2'
							onClick={onDelete}
						>
							<DynamicIcon className='size-4' name='trash' />
							<span>{t('tableVideo.delete')}</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		}
	}
]

const VideosTable: FC = () => {
	const { t } = useTranslation('studio')
	const { query } = useRouter()

	const [video, setVideo] = useState<IVideo>()
	const [loading, setLoading] = useState<boolean>(true)

	const [params, setParams] = useState<IPagination>({
		page: 1,
		perPage: 5
	})

	const [videosData, setVideosData] = useState<IStudioVideosResponse>({
		list: [],
		pagination: { page: 1, pageCount: 1, pageSize: 1, total: 0 }
	})

	const updateData = async () => {
		try {
			setLoading(true)
			const { data } = await VideoManagerService.getVideos(params)
			setVideosData(data)
			setLoading(false)
		} catch (e) {
			toastError(e)
			setLoading(false)
		}
	}

	useEffect(() => {
		;(async () => updateData())()
	}, [params, query, video])

	const columns = useMemo(() => getVideoColumns(updateData, setVideo, t), [t])

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

	const handlePageChange = (page: number) => {
		setParams(prev => ({ ...prev, page }))
	}

	return (
		<div className='w-full'>
			<div className='flex items-center py-4'>
				<VideoUploadModal video={video} setVideo={setVideo} />
				<div className='flex items-center gap-2 ml-auto'>
					<Button variant='outline' disabled={loading} onClick={updateData}>
						{t('update')}
						<DynamicIcon
							name='loader'
							className={`ml-2 h-4 w-4 ${loading && ' animate-spin'}`}
						/>
					</Button>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='outline'>
								{t('table.columns')}{' '}
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
								<TableRow key={row.id}>
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
									{t('table.notFound')}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<div className='flex items-center justify-end space-x-2 py-4'>
				<div className='flex-1 text-sm text-muted-foreground'>
					{table.getFilteredSelectedRowModel().rows.length} з{' '}
					{table.getFilteredRowModel().rows.length} рядків вибрано.
				</div>
				<div className='space-x-2'>
					<Button
						variant='outline'
						size='sm'
						onClick={() => handlePageChange(+params.page - 1)}
						disabled={params.page === 1}
					>
						{t('table.prevPage')}
					</Button>
					{Array.from(
						{ length: +(videosData.pagination.pageCount || 0) },
						(_, i) => i + 1
					).map(page => (
						<Button
							key={page}
							variant={page === +params.page ? 'default' : 'outline'}
							size='sm'
							onClick={() => handlePageChange(page)}
						>
							{page}
						</Button>
					))}
					<Button
						variant='outline'
						size='sm'
						onClick={() => handlePageChange(+params.page + 1)}
						disabled={params.page === videosData.pagination.pageCount}
					>
						{t('table.nextPage')}
					</Button>
				</div>
			</div>
		</div>
	)
}

export default VideosTable
