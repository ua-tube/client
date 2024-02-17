import { defaultChannel, videos, playlists } from '@/data'
import { FC, useState, useEffect } from 'react'
import { buttonVariants } from '@/components'
import { cn, getChannelUrl } from '@/utils'
import AboutChannel from './about-channel'
import { useRouter } from 'next/router'
import { TabType } from '@/interfaces'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CategoryPills = dynamic(() => import('@/components/categories/category-pills'))
const VideosList = dynamic(() => import('@/components/videos/general/videos-list'))
const VideosPills = dynamic(() => import('@/components/videos/general/videos-pills'))
const PlaylistsList = dynamic(() => import('@/components/playlist/general/playlists-list'))

const tabsKeys = ['index', 'videos', 'playlists'] as const

type TabsKey = typeof tabsKeys[number]

const tabs: TabType<TabsKey>[] = [
	{
		key: 'index',
		title: 'Головна',
		children: <div className="flex flex-col gap-y-3">
			<VideosPills title="Для вас" videos={videos.slice(2)} />
			<VideosPills title="Популярне" videos={videos.slice(5)} />
			<VideosPills title="Завантаження" videos={videos.slice(7)} />
		</div>
	},
	{
		key: 'videos',
		title: 'Відео',
		children: <div className="space-y-3">
			<CategoryPills categories={['Усі', 'Популярні', 'Найновіші', 'Найстаріші']} />
			<VideosList videos={videos} />
		</div>
	},
	{
		key: 'playlists',
		title: 'Плейлісти',
		children: <PlaylistsList playlists={playlists} />
	}
]

const AboutChannelContent: FC = () => {
	const { query, push } = useRouter()
	const [currTab, setCurrTab] = useState<TabsKey>('index')

	useEffect(() => {
		if (query?.tab)
			if (tabsKeys.includes(query.tab as TabsKey))
				setCurrTab(query?.tab as TabsKey)
			else
				setCurrTab('index')
		else setCurrTab('index')
	}, [query])

	return <div className="max-w-7xl mx-auto flex flex-col gap-y-5">
		<AboutChannel channel={defaultChannel} />
		<div
			className="space-x-3 border-accent border-b pb-2"
			children={
				tabs.map((value, index) =>
					<Link
						key={index}
						children={value.title}
						href={getChannelUrl(defaultChannel.nickName, value.key, true)}
						className={cn(buttonVariants({
							variant: value.key === currTab ?
								'secondary' : 'outline'
						}))}
					/>
				)}
		/>
		<div children={tabs.find(value => value?.key === currTab)?.children} />
	</div>

}

export default AboutChannelContent
