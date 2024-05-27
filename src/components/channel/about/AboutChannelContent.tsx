import { channelTabsKeys } from '@/data'
import { FC, useState, useEffect } from 'react'
import { buttonVariants } from '@/components'
import { ChannelTabsKeyType } from '@/types'
import { cn, getChannelUrl } from '@/utils'
import AboutChannel from './AboutChannel'
import { useRouter } from 'next/router'
import { TabType, ICreator } from '@/interfaces'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)
const VideosList = dynamic(
	() => import('@/components/videos/general/VideosList')
)
const VideosPills = dynamic(
	() => import('@/components/videos/general/VideosPills')
)
const PlaylistsList = dynamic(
	() => import('@/components/playlist/general/PlaylistsList')
)

const tabs: TabType<ChannelTabsKeyType>[] = [
	{
		key: 'videos',
		title: 'Відео',
		children: (
			<div className='space-y-3'>
				<CategoryPills
					categories={['Усі', 'Популярні', 'Найновіші', 'Найстаріші']}
				/>
				{/*<VideosList videos={videos} />*/}
			</div>
		)
	},
	{
		key: 'playlists',
		title: 'Плейлісти',
		children: <>{/*<PlaylistsList playlists={playlists} />*/}</>
	}
]

interface IAboutChannelContentProps {
	channel: ICreator
}

const AboutChannelContent: FC<IAboutChannelContentProps> = ({ channel }) => {
	const { query, push } = useRouter()
	const [currTab, setCurrTab] = useState<ChannelTabsKeyType>('index')

	useEffect(() => {
		if (query?.tab)
			if (channelTabsKeys.includes(query.tab as ChannelTabsKeyType))
				setCurrTab(query?.tab as ChannelTabsKeyType)
			else setCurrTab('index')
		else setCurrTab('index')
	}, [query])

	return (
		<div className='max-w-7xl mx-auto flex flex-col gap-y-5'>
			<AboutChannel channel={channel} />
			<div
				className='space-x-3 border-accent border-b pb-2'
				children={tabs.map((value, index) => (
					<Link
						key={index}
						children={value.title}
						href={getChannelUrl(channel.nickname, value.key, true)}
						className={cn(
							buttonVariants({
								variant: value.key === currTab ? 'secondary' : 'outline'
							})
						)}
					/>
				))}
			/>
			<div children={tabs.find(value => value?.key === currTab)?.children} />
		</div>
	)
}

export default AboutChannelContent
