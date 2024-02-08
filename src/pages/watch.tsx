import { AboutVideo, AppHead, CategoryPills, SidebarVideoList, VideoCommentsSection, Skeleton } from '@/components'
import { categories, defaultComments, defaultVideo, playlists, videos } from '@/data'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { HomeLayout } from '@/components/layouts'
import { IPlaylist, IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'

const CurrentVideoPlaylist = dynamic(
	() => import('@/components/playlist/current-video-playlist')
)

const VideoPlayer = dynamic(
	() => import('@/components/videos/player'), {
		ssr: false,
		loading: () => <Skeleton className="aspect-video bg-secondary rounded-lg" />
	})

const defaultVideosIds: string[] = videos.map(value => value.id)

export const getServerSideProps: GetServerSideProps<{
	video: IVideo,
	videoIds: { next: string, prev?: string },
	currList?: IPlaylist
}> = async ({ query }) => {
	let videoIds: {
		next: string,
		prev?: string
	} = { next: defaultVideosIds.at(Math.floor(Math.random() * defaultVideosIds.length)) || '' }
	let currList: IPlaylist | undefined
	const videoId = (query?.videoId as string) || ''
	let video = videos.find(value => value.id === videoId) || defaultVideo

	if (query?.listId) {
		currList = playlists.find(value => value.id == query.listId as string) || playlists[0]
		const currVideoIndex = currList.videos!.findIndex(v => v.id === videoId)
		if (currList.videos) {
			videoIds.next = currList.videos.length > currVideoIndex + 1 ?
				currList.videos?.[currVideoIndex + 1].id :
				currList.videos?.[0].id
			if (currVideoIndex !== 0 && currVideoIndex > 0)
				videoIds.prev = currList.videos?.[currVideoIndex - 1].id
		}
	}

	return { props: { video, videoIds, ...(currList && { currList }) } }
}

export default function VideoPage({
																		video,
																		videoIds,
																		currList
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={video.title} image={video.thumbnailUrl} disableDesc />
			<HomeLayout hiddenSidebar autoHideSidebar>
				<section className="mx-auto flex flex-col gap-8 md:flex-row">
					<div className="w-full md:w-3/4 flex flex-col gap-y-4">
						<VideoPlayer video={video} videoIds={videoIds} autoPlay />
						<AboutVideo video={video} />
						<VideoCommentsSection
							totalCount={4324}
							comments={defaultComments}
						/>
					</div>
					<div className="w-full md:w-1/4 flex flex-col gap-y-2">
						{currList && <CurrentVideoPlaylist currList={currList} currVideoId={video.id} />}
						<CategoryPills categories={categories.slice(2)} />
						<SidebarVideoList />
					</div>
				</section>
			</HomeLayout>
		</>
	)
}
