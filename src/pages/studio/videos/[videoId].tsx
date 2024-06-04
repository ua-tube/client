import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import { VideoManagerService } from '@/services'
import { useEffect, useState } from 'react'
import { VideoEditTabsKey } from '@/types'
import { videoEditTabsKeys } from '@/data'
import { IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'

const StudioLayout = dynamic(
	() => import('@/components/layouts/studio/StudioLayout'),
	{
		loading: () => <DynamicIcon name='loader' className='loader-container' />,
		ssr: false
	}
)

const VideoEditContent = dynamic(() => import('@/components/studio/video'), {
	ssr: false
})

export const getServerSideProps: GetServerSideProps<{
	tab: VideoEditTabsKey
	videoId: string
}> = async ({ query, locale }) => {
	let tab: VideoEditTabsKey = 'edit'
	const videoId = query.videoId as string

	if (query.tab && videoEditTabsKeys.includes(query.tab as VideoEditTabsKey))
		tab = query.tab as VideoEditTabsKey

	return {
		props: {
			tab,
			videoId,
			...(await serverSideTranslations(locale || 'uk', [
				'common',
				'general',
				'studio'
			]))
		}
	}
}

export default function StudioVideoPage({
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
			<StudioLayout>
				<VideoEditContent tab={tab} video={video} videoId={videoId} />
			</StudioLayout>
		</>
	)
}
