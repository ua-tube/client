import LargeSidebarItem, { ILargeSidebarItemProps } from './large-sidebar-item'
import { DynamicIcon } from '@/components'
import { FC, useState } from 'react'


export interface ILargeSidebarSectionProps {
	items: ILargeSidebarItemProps[]
	title?: string
	visibleItemCount?: number
}

const LargeSidebarSection: FC<
	ILargeSidebarSectionProps
> = ({
			 items,
			 title,
			 visibleItemCount = Number.POSITIVE_INFINITY
		 }) => {
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div>
			{title && (
				<div
					className="ml-3 mt-2 text-lg text-black dark:text-gray-200 font-semibold mb-1"
					children={title}
				/>
			)}
			<div
				className="transition-transform duration-300"
				children={
					items
						.slice(0, !isExpanded ? visibleItemCount : undefined)
						.map((value, index) =>
							<LargeSidebarItem key={index} {...value} />)
				}
			/>

			{items.length > visibleItemCount && (
				<button
					onClick={() => setIsExpanded(e => !e)}
					className="text-sm w-full flex items-center rounded-lg gap-5 px-3 py-1.5 hover:bg-muted-foreground hover:text-muted"
				>
					<div children={<DynamicIcon name={isExpanded ? 'chevron-up' : 'chevron-down'} />} />
					<span children={isExpanded ? 'Показати меньше' : 'Показати більше'} />
				</button>
			)}
		</div>
	)
}



export default LargeSidebarSection
