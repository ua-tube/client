import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { videos, defaultVideo, videoEditTabsKeys } from '@/data'
import VideoEditContent from '@/components/dashboard/video'
import { DynamicIcon, AppHead } from '@/components'
import { VideoEditTabsKey } from '@/types'
import { IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

export const getServerSideProps: GetServerSideProps<{
	video: IVideo
	tab: VideoEditTabsKey
}> = async ({ query }) => {
	let tab: VideoEditTabsKey = 'edit'
	const video =
		videos.find(value => value.id === (query?.videoId as string) || '') ||
		defaultVideo

	if (query.tab && videoEditTabsKeys.includes(query.tab as VideoEditTabsKey))
		tab = query.tab as VideoEditTabsKey

	return { props: { video, tab } }
}

export default function DashboardVideoPage({
	video,
	tab
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Редагування відео - ${video.title}`} />
			<DashboardLayout>
				<VideoEditContent tab={tab} video={video} />
			</DashboardLayout>
		</>
	)
}
