import { DataTableColumnHeader } from '@/components/dataTable/DataTableColumnHeader'
import { getDashboardVideoUrl, getVideoUrl } from '@/utils'
import { ColumnDef } from '@tanstack/react-table'
import { IVideo } from '@/interfaces'
import Link from 'next/link'
import {
	Checkbox,
	DynamicIcon,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	Progress,
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem
} from '@/components'


export const columns: ColumnDef<IVideo>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Вибрати всі рядки"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Вибрати рядок"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false
	},
	{
		id: 'Відео',
		accessorKey: 'title',
		filterFn: (row, id, value) => value.includes(row.getValue(id)),
		header: ({ column }) => <DataTableColumnHeader column={column} title="Відео" />,
		cell: ({ row: { original: value } }) =>
			<div className="group flex flex-row items-center space-x-3 pt-1">
				<div className="h-20 aspect-video rounded-lg">
					<img
						src={value.thumbnailUrl}
						alt={value.id}
						className="size-full object-cover"
					/>
				</div>
				<div className="relative max-w-lg">
					<p
						children={value.title}
						className="line-clamp-1 opacity-100 group-hover:opacity-0"
					/>
					<span
						className="text-sm line-clamp-2 text-muted-foreground opacity-100 group-hover:opacity-0"
						children={(value.description)?.slice(0, 120)}
					/>
					<div
						className="absolute left-0 top-0 size-full opacity-0 group-hover:opacity-100 flex items-center space-x-4"
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={getDashboardVideoUrl(value.id, 'edit')}
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
									href={getDashboardVideoUrl(value.id, 'analytics')}
									className="hover:bg-muted rounded-full p-2.5"
								>
									<DynamicIcon name="area-chart" className="size-5" />
								</Link>
							</TooltipTrigger>
							<TooltipContent children="Аналітика відео" />
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={getDashboardVideoUrl(value.id, 'comments')}
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
									href={getVideoUrl(value.id, undefined, undefined, true)}
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
	},
	{
		id: 'Видимість',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Видимість" />,
		cell: ({ row: { original } }) => (
			<Select defaultValue={`${original.visible || 2}`}>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Видимість" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="0">Приватне</SelectItem>
					<SelectItem value="1">Не для всіх</SelectItem>
					<SelectItem value="2">Для всіх</SelectItem>
				</SelectContent>
			</Select>
		)
	},
	{
		id: 'Ліміти',
		accessorKey: 'limits',
		filterFn: 'auto',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Ліміти" />,
		cell: ({ row: { original } }) => original.limits ? 'Авторські права' : 'Немає'
	},
	{
		id: 'Дата',
		accessorKey: 'postedAt',
		filterFn: 'auto',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Дата" />,
		cell: ({ row: { original } }) => new Date(original.postedAt).toLocaleString()
	},
	{
		id: 'Перегляди',
		accessorKey: 'views',
		filterFn: 'auto',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Перегляди" />,
		cell: ({ row: { original } }) => original.views || 0
	},
	{
		id: 'Коментарі',
		accessorKey: 'commentsCount',
		filterFn: 'auto',
		header: ({ column }) => <DataTableColumnHeader column={column} title="Коментарі" />,
		cell: ({ row: { original } }) => original.commentsCount || 0
	},
	{
		id: 'Уподобання',
		accessorKey: 'likesCount',
		filterFn: 'auto',
		header: ({ column }) => <DataTableColumnHeader column={column} title='"Подобається" (%)' />,
		cell: ({ row: { original } }) => {
			const percent = Math.floor((original.likesCount || 0) / ((original.likesCount || 0) + (original.disLikesCount || 0)) * 100) || 0
			return (
				<Tooltip>
					<TooltipTrigger>
						<div className="flex flex-col space-y-1">
							<div className="text-lg" children={`${percent}%`} />
							<span children={`${(original.likesCount || 0)} оцінок "подобається"`} />
							<Progress value={percent} className="h-1.5" />
						</div>
					</TooltipTrigger>
					<TooltipContent className="flex flex-row space-x-2">
						<div className="flex items-center space-x-2">
							<DynamicIcon name="thumbs-up" className="size-4" />
							<span children={original.likesCount || 0} />
						</div>
						<div className="flex items-center space-x-2">
							<DynamicIcon name="thumbs-down" className="size-4" />
							<span children={original.disLikesCount || 0} />
						</div>
					</TooltipContent>
				</Tooltip>
			)
		}
	}
]
