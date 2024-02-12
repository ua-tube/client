import { FC, ReactNode, useState, useEffect } from 'react'
import { defaultChannel, videos, playlists } from '@/data'
import AboutChannel from './about-channel'
import { getChannelUrl } from '@/utils'
import { useRouter } from 'next/router'
import { Button } from '@/components'
import dynamic from 'next/dynamic'

const CategoryPills = dynamic(() => import('@/components/categories/category-pills'))
const VideosList = dynamic(() => import('@/components/videos/general/videos-list'))
const VideosPills = dynamic(() => import('@/components/videos/general/videos-pills'))
const PlaylistsList = dynamic(() => import('@/components/playlist/general/playlists-list'))

type TabsKey = 'index' | 'videos' | 'playlists'
type TabType = { key: TabsKey, title: string, children: ReactNode }

const tabs: TabType[] = [
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
	const { query, push, asPath } = useRouter()
	const [curr, setCurr] = useState<TabsKey>('index')

	useEffect(() => {
		if (query?.tab)
			if (['index', 'videos', 'playlists'].includes(query.tab as string))
				setCurr(query?.tab as TabsKey)
			else
				setCurr('index')
		else setCurr('index')
	}, [query])

	const onChangeTab = async (tab: TabsKey) => push(getChannelUrl({ nickName: query.nickName as string }, tab))

	return <div className="max-w-7xl mx-auto flex flex-col gap-y-5">
		<AboutChannel channel={defaultChannel} />
		<div
			className="space-x-3 border-accent border-b pb-2"
			children={
				tabs.map((value, index) =>
					<Button
						key={index}
						children={value.title}
						onClick={async () => onChangeTab(value.key)}
						variant={value.key === curr ? 'secondary' : 'outline'}
					/>
				)}
		/>
		<div children={tabs.find(value => value?.key === curr)?.children} />
	</div>

}

export default AboutChannelContent
