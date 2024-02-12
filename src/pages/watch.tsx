import { categories, defaultComments, defaultVideo, playlists, videos } from '@/data'
import { AboutVideo, AppHead, Skeleton, DynamicIcon } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { IPlaylist, IVideo, IVideoState } from '@/interfaces'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const HomeLayout = dynamic(
	() => import('@/components/layouts/home'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const VideoPlayer = dynamic(
	() => import('@/components/videos/player'), {
		ssr: false,
		loading: () => <Skeleton className="aspect-video bg-secondary rounded-lg" />
	})

const VideoCommentsSection = dynamic(
	() => import('@/components/videos/comments'))

const CategoryPills = dynamic(
	() => import( '@/components/categories/category-pills')
)


const SidebarVideoList = dynamic(
	() => import( '@/components/videos/sidebar/sidebar-video-list')
)

const CurrentVideoPlaylist = dynamic(
	() => import('@/components/playlist/current-video-playlist')
)


export const getServerSideProps: GetServerSideProps<{
	video: IVideo,
	videoIds: { next: string, prev?: string },
	currList?: IPlaylist
}> = async ({ query, locale }) => {
	const defaultVideosIds: string[] = videos.map(value => value.id)
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
	const [videoState, setVideoState] = useState<IVideoState>({
		autoPlayNext: false,
		cinemaMode: false,
		isLooped: false,
		duration: 0,
		isLoading: true,
		quality: video.qualities?.at(-1) || '144p',
		speed: 1,
		volume: 0.5,
		isFullScreen: false,
		currentTime: 0,
		bufferedCount: 0,
		showAnimation: false,
		showNavigationMenu: true,
		disabledQualities: []
	})

	return (
		<>
			<AppHead title={video.title} image={video.thumbnailUrl} disableDesc />
			<HomeLayout hiddenSidebar disableBasePadding={videoState.cinemaMode}>
				{videoState.cinemaMode &&
					<VideoPlayer
						autoPlay
						{...{
							videoState,
							setVideoState,
							video,
							videoIds
						}}
					/>}
				<section className="mx-auto flex flex-col gap-6 md:flex-row px-2 lg:px-8 pb-4">
					<div className="w-full md:w-3/4 flex flex-col gap-y-4">
						{!videoState.cinemaMode &&
							<VideoPlayer
								autoPlay {...{
								videoState,
								setVideoState,
								video,
								videoIds
							}}
							/>}
						<AboutVideo video={video} />
						<VideoCommentsSection
							totalCount={4324}
							comments={defaultComments}
						/>
					</div>
					<div className="w-full md:w-1/4 flex flex-col gap-y-2">
						{currList &&
							<CurrentVideoPlaylist
								currList={currList}
								currVideoId={video.id}
							/>}
						<CategoryPills categories={categories.slice(2)} />
						<SidebarVideoList videos={videos} />
					</div>
				</section>
			</HomeLayout>
		</>
	)
}
