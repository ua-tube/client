import { DataTableViewOptions } from './data-table-view-options'
import { Input, Button, DynamicIcon } from '@/components'
import { Table } from '@tanstack/react-table'
import { DataTableFacetedFilter } from '@/components/data-table/data-table-faceted-filter'

interface DataTableToolbarProps<TData> {
	table: Table<TData>
}

export function DataTableToolbar<TData>({
																					table
																				}: DataTableToolbarProps<TData>) {

	const isFiltered = table.getState().columnFilters.length > 0

	return (
		<div className="flex items-center justify-between">
			<div className="flex flex-1 items-center space-x-2">
				<Input
					placeholder="Фільтрувати по імені"
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('title')?.setFilterValue(event.target.value)
					}
					className="h-8 w-[150px] lg:w-[250px]"
				/>
				{table.getColumn('visible') && (
					<DataTableFacetedFilter
						column={table.getColumn('visible')}
						title="Видимість"
						options={[
							{ label: 'Для всіх', value: '2', icon: 'eye' },
							{ label: 'Не для всіх', value: '1', icon: 'scan-eye' },
							{ label: 'Не видимий', value: '0', icon: 'eye-off' },
						]}
					/>
				)}
				{isFiltered && (
					<Button
						variant="secondary"
						onClick={() => table.resetColumnFilters()}
						className="h-8 px-2 lg:px-3"
					>
						Очистити
						<DynamicIcon name="x" className="ml-2 h-4 w-4" />
					</Button>
				)}
			</div>
			<DataTableViewOptions table={table} />
		</div>
	)
}
