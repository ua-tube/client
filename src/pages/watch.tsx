import { AboutVideo, AppHead, CategoryPills, SidebarVideoList, VideoCommentsSection } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { categories, defaultComments, defaultVideo } from '@/data'
import { HomeLayout } from '@/components/layouts'
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(
	() => import('@/components/videos/player'), {
		ssr: false,
		loading: () => <div className="aspect-video bg-secondary rounded-lg" />
	})

const defaultVideosIds: string[] = [
	'1b5a68680b00c658dc3dec16b5a27f0e',
	'85f080ed49cc2d52a1a4d1d252955e1d',
	'd6fe8454efd2c8253ead6ab79d34dddb',
	'6354c215a3c641a37ca7e4759da038ee',
	'361f18312f24eac5bf69f78189037d60',
	'f0e00bb2a86ff1cec67016b787634610',
	'9e040a7a6ef9df150ae9b5e3edf9429d',
	'dcfc673a421aa70e1ab78fda3b435d33'
]


export const getServerSideProps: GetServerSideProps<{
	videoId: string, nextVideoId: string
}> = async ({ query }) => {
	return {
		props: {
			videoId: (query?.videoId as string) || '',
			nextVideoId: defaultVideosIds.at(Math.floor(Math.random() * defaultVideosIds.length)) || ''
		}
	}
}

export default function VideoPage({
																		videoId, nextVideoId
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Перегляд відео ${videoId}`} />
			<HomeLayout hiddenSidebar autoHideSidebar>
				<section className="2xl:container mx-auto max-w-7xl flex flex-col gap-8 md:flex-row">
					<div className="w-full md:w-3/4 flex flex-col gap-y-4">
						<VideoPlayer
							videoId={videoId}
							nextVideoId={nextVideoId}
							qualities={defaultVideo?.qualities || ['144p']}
							autoPlay
						/>
						<AboutVideo video={defaultVideo} />
						<VideoCommentsSection totalCount={4324} comments={defaultComments} />
					</div>
					<div className="w-full md:w-1/4 flex flex-col gap-y-2">
						<CategoryPills categories={categories.slice(2)} />
						<SidebarVideoList />
					</div>
				</section>
			</HomeLayout>
		</>
	)
}
