import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import { IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'
import { videos } from '@/data'


const HomeLayout = dynamic(
	() => import('@/components/layouts/home'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const VideosList = dynamic(() => import('@/components/videos/general/videos-list'))

export const getServerSideProps: GetServerSideProps<{
	subsVideos: IVideo[]
}> = async ({ locale }) => {
	return { props: { subsVideos: videos } }
}

export default function SubscriptionsPage({
																		subsVideos
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title="Підписки" />
			<HomeLayout hiddenSidebar>
				<section className="mx-auto">
					<VideosList title="Нові відео" videos={subsVideos} />
				</section>
			</HomeLayout>
		</>
	)
}