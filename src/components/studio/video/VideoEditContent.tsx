import { IVideo, TabType } from '@/interfaces'
import { buttonVariants } from '@/components'
import { useTranslation } from 'next-i18next'
import { VideoEditTabsKey } from '@/types'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import Link from 'next/link'
import { cn } from '@/utils'

interface IVideoEditContentProps {
	tab: VideoEditTabsKey
	video?: IVideo
	videoId: string
}

const VideoEditTab = dynamic(
	() => import('@/components/studio/video/tabs/VideoEditTab')
)

const VideoCommentsTab = dynamic(
	() => import('@/components/studio/video/tabs/VideoCommentsTab')
)

const VideoEditContent: FC<IVideoEditContentProps> = ({
	tab,
	video,
	videoId
}) => {
	const { t } = useTranslation('studio')

	const videoEditTabs: TabType<VideoEditTabsKey>[] = [
		{
			title: t('tableVideo.edit'),
			key: 'edit',
			children: <VideoEditTab video={video} />
		},
		{
			title: t('videoComments'),
			key: 'comments',
			children: <VideoCommentsTab video={video} videoId={videoId} />
		}
	]

	return (
		<div>
			<h2
				className='text-3xl font-bold tracking-tight flex items-center py-4'
				children={`${videoEditTabs?.find(value => value?.key === tab)?.title} - ${video?.title}`}
			/>
			<div
				className='space-x-3 border-accent border-b pb-2'
				children={videoEditTabs.map((value, index) => (
					<Link
						key={index}
						children={value.title}
						href={`/studio/videos/${video?.id}?tab=${value.key}`}
						className={cn(
							buttonVariants({
								variant: value.key === tab ? 'secondary' : 'outline'
							})
						)}
					/>
				))}
			/>
			<div
				className='mt-6'
				children={videoEditTabs.find(value => value?.key === tab)?.children}
			/>
		</div>
	)
}

export default VideoEditContent
