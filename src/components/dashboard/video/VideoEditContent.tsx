import { TabType, IVideo } from '@/interfaces'
import { buttonVariants } from '@/components'
import { VideoEditTabsKey } from '@/types'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import Link from 'next/link'
import { cn } from '@/utils'

interface IVideoEditContentProps {
	tab: VideoEditTabsKey
	video: IVideo
}

const VideoEditTab = dynamic(
	() => import('@/components/dashboard/video/tabs/VideoEditTab')
)
const VideoAnalyticsTab = dynamic(
	() => import('@/components/dashboard/video/tabs/VideoAnalyticsTab')
)
const VideoCommentsTab = dynamic(
	() => import('@/components/dashboard/video/tabs/VideoCommentsTab')
)

const videoEditTabs: TabType<VideoEditTabsKey>[] = [
	{ title: 'Редагування відео', key: 'edit', children: <VideoEditTab /> },
	{
		title: 'Аналітика відео',
		key: 'analytics',
		children: <VideoAnalyticsTab />
	},
	{ title: 'Коментарі відео', key: 'comments', children: <VideoCommentsTab /> }
]

const VideoEditContent: FC<IVideoEditContentProps> = ({ tab, video }) => {
	return (
		<div>
			<h2
				className='text-3xl font-bold tracking-tight flex items-center py-4'
				children={`${videoEditTabs.find(value => value?.key === tab)?.title} - ${video.title}`}
			/>
			<div
				className='space-x-3 border-accent border-b pb-2'
				children={videoEditTabs.map((value, index) => (
					<Link
						key={index}
						children={value.title}
						href={`/dashboard/videos/${video.id}?tab=${value.key}`}
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
				children={videoEditTabs.find(value => value?.key === tab)?.children}
			/>
		</div>
	)
}

export default VideoEditContent
