import SidebarItem, { ISidebarItemProps } from './SidebarItem'
import { DynamicIcon } from '@/components'
import { FC, useState } from 'react'
import { useTranslation } from 'next-i18next'

export interface ISidebarSectionProps {
	items: ISidebarItemProps[]
	title?: string
	visibleItemCount?: number
}

const SidebarSection: FC<ISidebarSectionProps> = ({
	items,
	title,
	visibleItemCount = Number.POSITIVE_INFINITY
}) => {
	const { t } = useTranslation('home-sidebar')
	const [isExpanded, setIsExpanded] = useState(false)

	return (
		<div>
			{title && (
				<div
					className='ml-3 mt-2 text-lg text-black dark:text-gray-200 font-semibold mb-1'
					children={title}
				/>
			)}
			<div
				className='transition-transform duration-300'
				children={items
					.slice(0, !isExpanded ? visibleItemCount : undefined)
					.map((value, index) => (
						<SidebarItem key={index} {...value} />
					))}
			/>

			{items.length > visibleItemCount && (
				<button
					onClick={() => setIsExpanded(e => !e)}
					className='text-sm w-full flex items-center rounded-lg gap-5 px-3 py-1.5 hover:bg-muted-foreground hover:text-muted'
				>
					<div
						children={
							<DynamicIcon name={isExpanded ? 'chevron-up' : 'chevron-down'} />
						}
					/>
					<span children={t(isExpanded ? 'showLess' : 'showMore')} />
				</button>
			)}
		</div>
	)
}

export default SidebarSection
