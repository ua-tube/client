import { AboutVideo, AppHead, DynamicIcon, Skeleton } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
	LibraryService,
	SubscriptionsService,
	VideoManagerService
} from '@/services'
import { IPlaylist, IVideo } from '@/interfaces'
import { cn, getImageUrl } from '@/utils'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const VideoPlayer = dynamic(() => import('@/components/videos/player'), {
	ssr: false,
	loading: () => <Skeleton className='aspect-video bg-secondary rounded-lg' />
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
	listId: string
	// videoIds: { next: string; prev?: string }
	// currList?: IPlaylist
}> = async ({ query, locale }) => {
	const videoId = (query?.videoId as string) || ''
	const listId = (query?.listId as string) || ''

	return { props: { videoId, listId } }
}

export default function VideoPage({
	videoId,
	listId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [cinemaMode, setCinemaMode] = useState(false)
	const [video, setVideo] = useState<IVideo>()
	const [playlist, setPlaylist] = useState<IPlaylist>()
	const [videoIds, setVideoIds] = useState<{ next?: string; prev?: string }>()

	useEffect(() => {
		;(async () => {
			const { data } = await VideoManagerService.getVideo(videoId)
			const { data: creator } = await SubscriptionsService.getSubscriptionInfo(
				data.creatorId!
			)
			if (listId && listId.length > 0) {
				const { data: playlist } = await LibraryService.getAllVideosByPlaylist({
					t: listId,
					page: 1,
					perPage: 50
				})
				setPlaylist(playlist)
				if (playlist.videos) {
					const currVideoIndex = playlist.videos.list.findIndex(
						v => v.id === videoId
					)
					if (typeof currVideoIndex !== 'undefined') {
						setVideoIds({
							next:
								currVideoIndex < playlist.videos.list?.length
									? playlist.videos.list.at(currVideoIndex + 1)?.id
									: playlist.videos.list.at(0)?.id,
							prev:
								currVideoIndex > 0
									? playlist.videos.list.at(currVideoIndex - 1)?.id
									: playlist.videos.list.at(-1)?.id
						})
					}
				}
			}
			setVideo({ ...data, creator })
		})()
	}, [videoId, listId])

	const SideBar: FC = () => (
		<>
			{playlist && (
				<CurrentVideoPlaylist currVideoId={videoId} currList={playlist} />
			)}
		</>
	)

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
				<section className='mx-auto flex flex-col gap-6 md:flex-row pb-4'>
					<div
						className={cn(
							'flex flex-col gap-y-4 transform transition-transform duration-300',
							cinemaMode ? 'w-full' : 'md:w-4/6'
						)}
					>
						{video && (
							<VideoPlayer
								autoPlay
								{...{
									cinemaMode,
									setCinemaMode,
									video,
									videoIds
								}}
							/>
						)}
						{!cinemaMode && (
							<div
								className='w-full flex flex-col gap-y-4'
								children={<LeftSidebar />}
							/>
						)}
					</div>
					{!cinemaMode && (
						<div
							className='w-full md:w-2/6 flex flex-col gap-y-2'
							children={<SideBar />}
						/>
					)}
				</section>

				{cinemaMode && (
					<section className='mx-auto flex flex-col gap-6 md:flex-row px-2 lg:px-8 pb-4'>
						<div
							className='w-full md:w-4/6 flex flex-col gap-y-4'
							children={<LeftSidebar />}
						/>
						<div
							className='w-full md:w-2/6 flex flex-col gap-y-2'
							children={<SideBar />}
						/>
					</section>
				)}
			</HomeLayout>
		</>
	)
}
