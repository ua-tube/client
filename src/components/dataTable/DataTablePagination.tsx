import {
	Button,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	DynamicIcon
} from '@/components'
import { Table } from '@tanstack/react-table'
import { useRouter } from 'next/router'

interface DataTablePaginationProps<TData> {
	table: Table<TData>
}

export function DataTablePagination<TData>({
	table
}: DataTablePaginationProps<TData>) {
	const { query, push, pathname } = useRouter()

	const changePerPage = async (perPage: string) =>
		push({ pathname, query: { perPage, page: 1 } })

	const changePage = async (page: number) =>
		push({
			pathname,
			query: {
				page,
				perPage:
					(query?.perPage as string | undefined) ||
					table.getState().pagination.pageSize ||
					20
			}
		})

	return (
		<div className='flex items-center justify-between px-2'>
			<div className='flex-1 text-sm text-muted-foreground'>
				{table.getFilteredSelectedRowModel().rows.length} з{' '}
				{table.getFilteredRowModel().rows.length} рядків вибрано.
			</div>
			<div className='flex items-center space-x-6 lg:space-x-8'>
				<div className='flex items-center space-x-2'>
					<p className='text-sm font-medium'>Рядки в</p>
					<Select
						value={
							(query?.perPage as string | undefined) ||
							`${table.getState().pagination.pageSize}`
						}
						onValueChange={async perPage => changePerPage(perPage)}
					>
						<SelectTrigger className='h-8 w-[70px]'>
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent
							side='top'
							children={[10, 20, 30, 40, 50].map(pageSize => (
								<SelectItem
									key={pageSize}
									value={`${pageSize}`}
									children={pageSize}
								/>
							))}
						/>
					</Select>
				</div>
				<div className='flex w-[100px] items-center justify-center text-sm font-medium'>
					Сторінка {table.getState().pagination.pageIndex + 1} з{' '}
					{table.getPageCount()}
				</div>
				<div className='flex items-center space-x-2'>
					<Button
						variant='outline'
						className='hidden h-8 w-8 p-0 lg:flex'
						onClick={async () => changePage(1)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Перейти на першу сторінку</span>
						<DynamicIcon name='arrow-left-circle' className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						className='h-8 w-8 p-0'
						onClick={async () =>
							changePage(table.getState().pagination.pageIndex)
						}
						disabled={!table.getCanPreviousPage()}
					>
						<span className='sr-only'>Перейти на попередню сторінку</span>
						<DynamicIcon name='arrow-left' className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						className='h-8 w-8 p-0'
						onClick={async () =>
							changePage(table.getState().pagination.pageIndex + 1)
						}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Наступна сторінка</span>
						<DynamicIcon name='arrow-right' className='h-4 w-4' />
					</Button>
					<Button
						variant='outline'
						className='hidden h-8 w-8 p-0 lg:flex'
						onClick={async () => changePage(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className='sr-only'>Перейти на останню сторінку</span>
						<DynamicIcon name='arrow-right-circle' className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
