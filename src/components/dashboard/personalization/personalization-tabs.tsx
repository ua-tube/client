import { FC, useState, useEffect } from 'react'
import { buttonVariants } from '@/components'
import { useRouter } from 'next/router'
import { TabType } from '@/interfaces'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { cn } from '@/utils'

const EditImagesTab = dynamic(() => import('./edit-images-tab'))
const EditInfoTab = dynamic(() => import('./edit-info-tab'))

const tabsKeys = ['images', 'details'] as const

type TabsKey = typeof tabsKeys[number]

const tabs: TabType<TabsKey>[] = [
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

const DashboardPersonalizationTabs: FC = () => {
	const { query } = useRouter()
	const [currTab, setCurrTab] = useState<TabsKey>('images')

	useEffect(() => {
		if (query?.tab)
			if (tabsKeys.includes(query.tab as TabsKey)) setCurrTab(query?.tab as TabsKey)
			else setCurrTab('images')
		else setCurrTab('images')
	}, [query])


	return <div>
		<div
			className="space-x-3 border-accent border-b pb-2"
			children={
				tabs.map((value, index) =>
					<Link
						key={index}
						children={value.title}
						href={`/dashboard/personalization?tab=${value.key}`}
						className={cn(buttonVariants({
							variant: value.key === currTab ?
								'secondary' : 'outline'
						}))}
					/>
				)}
		/>
		<div
			className="mt-6 max-w-4xl"
			children={tabs.find(value => value?.key === currTab)?.children}
		/>
	</div>

}

export default DashboardPersonalizationTabs
