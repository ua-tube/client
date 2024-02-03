import { AboutVideo, AppHead, CategoryPills, SidebarVideoList } from '@/components'
import { HomeLayout } from '@/components/layouts'
import VideoCommentsSection from '@/components/videos/comments/video-coments-section'
import { categories, defaultComments, defaultVideo } from '@/data'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(() => import('@/components/videos/player'), { ssr: false })

export const getServerSideProps: GetServerSideProps<{
	videoId: string
}> = async ({ query }) => {
	return { props: { videoId: (query?.videoId as string) || '' } }
}

export default function ShopPage({
																	 videoId
																 }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Перегляд відео ${videoId}`} />
			<HomeLayout hiddenSidebar autoHideSidebar>
				<section className="xl:container mx-auto max-w-8xl flex flex-col gap-8 md:flex-row">
					<div className="w-full md:w-2/3 flex flex-col gap-y-4">
						<VideoPlayer
							videoId={videoId}
							qualities={defaultVideo?.qualities || ['144p']}
							autoPlay
							nextVideoId={videoId !== defaultVideo.id ? 'nRc6934CNs1' : 'sg4t3ct32ag'}
						/>
						<AboutVideo video={defaultVideo} />
						<VideoCommentsSection totalCount={4324} comments={defaultComments}/>
					</div>
					<div className="w-full md:w-1/3 flex flex-col gap-y-2">
						<CategoryPills categories={categories.slice(2)} />
						<SidebarVideoList />
					</div>
				</section>
			</HomeLayout>
		</>
	)
}
