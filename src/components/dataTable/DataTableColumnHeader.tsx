import { Column } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import { cn } from '@/utils'
import {
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DynamicIcon
} from '@/components'

interface DataTableColumnHeaderProps<TData, TValue>
	extends HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
																											 column,
																											 title,
																											 className
																										 }: DataTableColumnHeaderProps<TData, TValue>) {

	if (!column.getCanSort())
		return <div className={cn(className)}>{title}</div>
	else
		return (
			<div className={cn('flex items-center space-x-2', className)}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="ghost"
							size="sm"
							className="-ml-3 h-8 data-[state=open]:bg-accent"
						>
							<span>{title}</span>
							{column.getIsSorted() === 'desc' ? (
								<DynamicIcon name="arrow-down" className="ml-2 h-4 w-4" />
							) : column.getIsSorted() === 'asc' ? (
								<DynamicIcon name="arrow-up" className="ml-2 h-4 w-4" />
							) : (
								<DynamicIcon name="pencil" className="ml-2 h-4 w-4" />
							)}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start">
						<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
							<DynamicIcon name="arrow-up" className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
							Зростання
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
							<DynamicIcon name="arrow-down" className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
							Спадання
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
							<DynamicIcon name="eye-off" className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
							Приховати
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		)
}
