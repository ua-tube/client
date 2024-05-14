import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { Column } from '@tanstack/react-table'
import { cn } from '@/utils'
import {
	Command,
	Separator,
	Badge,
	Button,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	Popover,
	PopoverTrigger,
	PopoverContent,
	DynamicIcon
} from '@/components'

interface DataTableFacetedFilterProps<TData, TValue> {
	column?: Column<TData, TValue>
	title?: string
	options: {
		label: string
		value: string
		icon?: keyof typeof dynamicIconImports
	}[]
}

export function DataTableFacetedFilter<TData, TValue>({
	column,
	title,
	options
}: DataTableFacetedFilterProps<TData, TValue>) {
	const facets = column?.getFacetedUniqueValues()
	const selectedValues = new Set(column?.getFilterValue() as string[])

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button variant='outline' size='sm' className='h-8 border-dashed'>
					<DynamicIcon name='plus-circle' className='mr-2 h-4 w-4' />
					{title}
					{selectedValues?.size > 0 && (
						<>
							<Separator orientation='vertical' className='mx-2 h-4' />
							<Badge
								variant='secondary'
								className='rounded-sm px-1 font-normal lg:hidden'
								children={selectedValues.size}
							/>
							<div
								className='hidden space-x-1 lg:flex'
								children={
									selectedValues.size > 2 ? (
										<Badge
											variant='secondary'
											className='rounded-sm px-1 font-normal'
											children={`${selectedValues.size} вибрано`}
										/>
									) : (
										options
											.filter(option => selectedValues.has(option.value))
											.map(option => (
												<Badge
													variant='secondary'
													key={option.value}
													className='rounded-sm px-1 font-normal'
													children={option.label}
												/>
											))
									)
								}
							/>
						</>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0' align='start'>
				<Command>
					<CommandInput placeholder={title} />
					<CommandList>
						<CommandEmpty children='Результатів не знайдено' />
						<CommandGroup
							children={options.map(option => {
								const isSelected = selectedValues.has(option.value)
								return (
									<CommandItem
										key={option.value}
										onSelect={() => {
											isSelected
												? selectedValues.delete(option.value)
												: selectedValues.add(option.value)

											const filterValues = Array.from(selectedValues)
											column?.setFilterValue(
												filterValues.length ? filterValues : undefined
											)
										}}
									>
										<div
											className={cn(
												'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible'
											)}
										>
											<DynamicIcon name='check' className='size-4' />
										</div>
										{option.icon && (
											<DynamicIcon
												name={option.icon}
												className='mr-2 h-4 w-4 text-muted-foreground'
											/>
										)}
										<span children={option.label} />
										{facets?.get(option.value) && (
											<span
												className='ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs'
												children={facets.get(option.value)}
											/>
										)}
									</CommandItem>
								)
							})}
						/>
						{selectedValues.size > 0 && (
							<>
								<CommandSeparator />
								<CommandGroup>
									<CommandItem
										onSelect={() => column?.setFilterValue(undefined)}
										className='justify-center text-center'
									>
										Очистити фільтри
									</CommandItem>
								</CommandGroup>
							</>
						)}
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	)
}
