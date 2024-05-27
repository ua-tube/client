import { Checkbox, DynamicIcon, Tooltip, TooltipTrigger, TooltipContent } from '@/components'
import { DataTableColumnHeader } from '@/components/dataTable/DataTableColumnHeader'
import { getDashboardVideoUrl, getVideoUrl, getImageUrl } from '@/utils'
import { ColumnDef } from '@tanstack/react-table'
import { IVideo } from '@/interfaces'
import Link from 'next/link'

export const videoEditColumns: ColumnDef<IVideo>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && 'indeterminate')
				}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Вибрати всі рядки"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
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
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Відео" />
		),
		cell: ({ row: { original: value } }) => (
			<div className="group flex flex-row items-center space-x-3 pt-1">
				<div className="h-20 aspect-video rounded-lg">
					<img
						src={getImageUrl(value.thumbnailUrl)}
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
						children={value.description?.slice(0, 120)}
					/>
					<div
						className="absolute left-0 top-0 size-full opacity-0 group-hover:opacity-100 flex items-center space-x-4">
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
		)
	},
	{
		id: 'Видимість',
		accessorKey:'visibility',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Видимість" />
		),
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
		id: 'Статус',
		accessorKey: 'status',
		header: ({ column }) => (<DataTableColumnHeader column={column} title="Статус" />),
	},
	{
		id: 'Дата створення',
		accessorKey: 'createdAt',
		filterFn: 'auto',
		header: ({ column }) => (<DataTableColumnHeader column={column} title="Дата" />),
		cell: ({ row: { original } }) =>
			new Date(original.createdAt || '').toLocaleString()
	},
	{
		id: 'Дата оновлення',
		accessorKey: 'updatedAt',
		filterFn: 'auto',
		header: ({ column }) => (<DataTableColumnHeader column={column} title="Дата" />),
		cell: ({ row: { original } }) =>
			new Date(original.updatedAt || '').toLocaleString()
	}
]
