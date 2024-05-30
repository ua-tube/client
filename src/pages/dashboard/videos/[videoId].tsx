import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import { VideoManagerService } from '@/services'
import { useEffect, useState } from 'react'
import { VideoEditTabsKey } from '@/types'
import { videoEditTabsKeys } from '@/data'
import { IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{
		loading: () => <DynamicIcon name='loader' className='loader-container' />,
		ssr: false
	}
)

const VideoEditContent = dynamic(() => import('@/components/dashboard/video'), {
	ssr: false
})

export const getServerSideProps: GetServerSideProps<{
	tab: VideoEditTabsKey
	videoId: string
}> = async ({ query }) => {
	let tab: VideoEditTabsKey = 'edit'
	const videoId = query.videoId as string

	if (query.tab && videoEditTabsKeys.includes(query.tab as VideoEditTabsKey))
		tab = query.tab as VideoEditTabsKey

	return { props: { tab, videoId } }
}

export default function DashboardVideoPage({
	tab,
	videoId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [video, setVideo] = useState<IVideo>()

	useEffect(() => {
		;(async () => {
			const { data } = await VideoManagerService.getVideo(videoId)
			setVideo(data)
		})()
	}, [])

	return (
		<>
			<AppHead title={`Редагування відео - ${video?.title}`} />
			<DashboardLayout>
				<VideoEditContent tab={tab} video={video} videoId={videoId} />
			</DashboardLayout>
		</>
	)
}
