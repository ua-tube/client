import { AppHead, Skeleton, DynamicIcon, AboutVideo } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { useState, useEffect, FC } from 'react'
import dynamic from 'next/dynamic'
import { VideoManagerService, SubscriptionsService } from '@/services'
import { IVideo } from '@/interfaces'
import { getImageUrl, cn } from '@/utils'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name="loader" className="loader-container" />
})

const VideoPlayer = dynamic(() => import('@/components/videos/player'), {
	ssr: false,
	loading: () => <Skeleton className="aspect-video bg-secondary rounded-lg" />
})

const VideoCommentsSection = dynamic(
	() => import('@/components/videos/comments')
)

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)

const SidebarVideoList = dynamic(
	() => import('@/components/videos/sidebar/SidebarVideoList')
)

const CurrentVideoPlaylist = dynamic(
	() => import('@/components/playlist/CurrentVideoPlaylist')
)

export const getServerSideProps: GetServerSideProps<{
	videoId: string
	// videoIds: { next: string; prev?: string }
	// currList?: IPlaylist
}> = async ({ query, locale }) => {
	const videoId = (query?.videoId as string) || ''

	// const defaultVideosIds: string[] = videos.map(value => value.id)
	// let videoIds: {
	// 	next: string
	// 	prev?: string
	// }
	// =
	// 	{
	// 	next:
	// 		defaultVideosIds.at(
	// 			Math.floor(Math.random() * defaultVideosIds.length)
	// 		) || ''
	// }
	// let currList: IPlaylist | undefined
	//
	// let video = videos.find(value => value.id === videoId) || defaultVideo
	//
	// if (query?.listId) {
	// 	currList =
	// 		playlists.find(value => value.id == (query.listId as string)) ||
	// 		playlists[0]
	// 	const currVideoIndex = currList.videos!.findIndex(v => v.id === videoId)
	// 	if (currList.videos) {
	// 		videoIds.next =
	// 			currList.videos.length > currVideoIndex + 1
	// 				? currList.videos?.[currVideoIndex + 1].id
	// 				: currList.videos?.[0].id
	// 		if (currVideoIndex !== 0 && currVideoIndex > 0)
	// 			videoIds.prev = currList.videos?.[currVideoIndex - 1].id
	// 	}
	// }

	return {
		props: {
			videoId
			// videoIds: [] as any[],
			// ...(currList && { currList })
		}
	}
}

export default function VideoPage({
																		videoId
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {

	const [cinemaMode, setCinemaMode] = useState(false)
	const [video, setVideo] = useState<IVideo>()

	useEffect(() => {
		;(async () => {
			const { data } = await VideoManagerService.getVideo(videoId)
			const { data: creator } = await SubscriptionsService.getSubscriptionInfo(data.creatorId!)
			setVideo({ ...data, creator })
		})()
	}, [])

	const SideBar: FC = () => <>
	</>

	const LeftSidebar: FC = () => (
		<>
			<AboutVideo video={video} videoId={videoId} />
			<VideoCommentsSection videoId={videoId} video={video} />
		</>
	)

	return (
		<>
			<AppHead
				title={`${video?.title}`}
				image={getImageUrl(video?.thumbnailUrl)}
				disableDesc
			/>
			<HomeLayout openInDrawer>
				<section className="mx-auto flex flex-col gap-6 md:flex-row pb-4">
					<div
						className={cn(
							'flex flex-col gap-y-4 transform transition-transform duration-300',
							cinemaMode ? 'w-full' : 'md:w-3/4'
						)}
					>
						{video && (
							<VideoPlayer autoPlay {...{ cinemaMode, setCinemaMode, video, videoIds: { next: '' } }} />
						)}
						{!cinemaMode && (<div className="w-full flex flex-col gap-y-4" children={<LeftSidebar />} />)}
					</div>
					{!cinemaMode && (<div className="w-full md:w-1/4 flex flex-col gap-y-2" children={<SideBar />} />)}
				</section>

				{cinemaMode && (
					<section className="mx-auto flex flex-col gap-6 md:flex-row px-2 lg:px-8 pb-4">
						<div className="w-full md:w-3/4 flex flex-col gap-y-4" children={<LeftSidebar />} />
						<div className="w-full md:w-1/4 flex flex-col gap-y-2" children={<SideBar />} />
					</section>
				)}
			</HomeLayout>
		</>
	)
}
