import { ChannelPersonalizationTabsKey } from '@/types'
import { buttonVariants } from '@/components'
import { TabType } from '@/interfaces'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { cn } from '@/utils'
import { FC } from 'react'

const EditImagesTab = dynamic(() => import('./EditImagesTab'))
const EditInfoTab = dynamic(() => import('./EditInfoTab'))

const tabs: TabType<ChannelPersonalizationTabsKey>[] = [
	{
		key: 'images',
		title: 'Оформлення каналу',
		children: <EditImagesTab />
	},
	{
		key: 'details',
		title: 'Інформація про канал',
		children: <EditInfoTab />
	}
]

interface IDashboardPersonalizationTabsProps {
	tab: ChannelPersonalizationTabsKey
}

const DashboardPersonalizationTabs: FC<IDashboardPersonalizationTabsProps> = ({
	tab
}) => {
	return (
		<div>
			<h2 className='text-3xl font-bold tracking-tight flex items-center py-4'>
				Персоналізація каналу
			</h2>
			<div
				className='space-x-3 border-accent border-b pb-2'
				children={tabs.map((value, index) => (
					<Link
						key={index}
						children={value.title}
						href={`/dashboard/personalization?tab=${value.key}`}
						className={cn(
							buttonVariants({
								variant: value.key === tab ? 'secondary' : 'outline'
							})
						)}
					/>
				))}
			/>
			<div
				className='mt-6 max-w-4xl'
				children={tabs.find(value => value?.key === tab)?.children}
			/>
		</div>
	)
}

export default DashboardPersonalizationTabs
