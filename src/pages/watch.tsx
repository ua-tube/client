import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { IPlaylist, ISearchVideosResponse, IVideo } from '@/interfaces'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon, Skeleton } from '@/components'
import { FC, useEffect, useState } from 'react'
import { cn, getImageUrl } from '@/utils'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { HistoryService, LibraryService, SubscriptionsService, VideoService } from '@/services'

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)

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

const AboutVideo = dynamic(() => import('@/components/videos/about'), {
	ssr: false
})

const SidebarVideoList = dynamic(
	() => import('@/components/videos/sidebar/SidebarVideoList')
)

const CurrentVideoPlaylist = dynamic(
	() => import('@/components/playlist/CurrentVideoPlaylist')
)

const notFoundDestination = `/404?message=${encodeURIComponent('Даного відео не знайдено!')}`

export const getServerSideProps: GetServerSideProps<{
	videoId: string
	listId: string
}> = async ({ query, locale }) => {
	const videoId = (query?.videoId as string) || ''
	const listId = (query?.listId as string) || ''

	return videoId && videoId !== ''
		? {
			props: {
				videoId,
				listId,
				...(await serverSideTranslations(locale || 'uk', [
					'common',
					'general',
					'comments',
					'videos',
					'home-sidebar',
					'notifications',
					'share',
					'playlist'
				]))
			}
		}
		: { redirect: { permanent: true, destination: notFoundDestination } }
}

export default function VideoPage({
																		videoId,
																		listId
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { replace } = useRouter()
	const [cinemaMode, setCinemaMode] = useState(false)

	const [video, setVideo] = useState<IVideo>()
	const [playlist, setPlaylist] = useState<IPlaylist>()

	const [relatedVideos, setRelatedVideos] = useState<ISearchVideosResponse>()
	const [currTag, setCurrTag] = useState<string>()

	useEffect(() => {
		;(async () => {
			try {
				let newVideo: IVideo

				const { data } = await VideoService.getVideo(videoId)

				const { data: searchVideos } =
					await VideoService.searchRelatedVideosByVideoId({
						page: 1,
						perPage: 25,
						videoId
					})

				setRelatedVideos(searchVideos)

				const { data: creator } =
					await SubscriptionsService.getSubscriptionInfo(data.creatorId!)

				newVideo = {
					...data,
					masterPlaylistUrl: `${process.env.STORAGE_SERVER_URL}${data?.masterPlaylistUrl}`,
					creator
				}
				setVideo(newVideo)

				await HistoryService.createHistoryRecord({ videoId })

				if (listId && listId.length > 0) {
					let videoIds: { nextId?: string; prevId?: string } | undefined

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
							videoIds = {
								nextId:
									currVideoIndex < playlist.videos.list?.length
										? playlist.videos.list.at(currVideoIndex + 1)?.id
										: playlist.videos.list.at(0)?.id,
								prevId:
									currVideoIndex > 1
										? playlist.videos.list.at(currVideoIndex - 1)?.id
										: undefined
							}
						} else if (relatedVideos && relatedVideos?.hits.length > 0) {
							videoIds = { nextId: relatedVideos?.hits?.[0]?.id }
						}
						if (videoIds)
							setVideo({ ...newVideo, ...(videoIds && videoIds) })
					}
				}
			} catch (e: any) {
				e.status === 404 && (await replace(notFoundDestination))
			}
		})()
	}, [videoId])


	const SideBar: FC = () => (
		<>
			{playlist && (
				<CurrentVideoPlaylist currVideoId={videoId} currList={playlist} />
			)}
			{relatedVideos && (
				<>
					<CategoryPills
						data={Object.keys(relatedVideos?.facetDistribution.tags)}
						value={currTag}
						onChange={s => setCurrTag(s)}
					/>
					<SidebarVideoList
						videos={
							currTag
								? relatedVideos.hits.filter(v =>
									v.tags?.some((v: string) => v === currTag)
								)
								: relatedVideos.hits
						}
					/>
				</>
			)}
		</>
	)

	const LeftSidebar: FC = () => (
		<>
			<AboutVideo video={video} videoId={videoId} />
			<VideoCommentsSection videoId={videoId} />
		</>
	)

	return (
		<>
			<AppHead
				title={video?.title || 'Video'}
				image={getImageUrl(video?.thumbnailUrl)}
				disableDesc
			/>
			<HomeLayout openInDrawer>
				<section className="mx-auto flex flex-col gap-6 md:flex-row pb-4">
					<div
						className={cn(
							'flex flex-col gap-y-4 transform transition-transform duration-300 md:pr-3',
							cinemaMode ? 'w-full' : 'md:w-3/4'
						)}
					>
						{video ? (
							<VideoPlayer autoPlay {...{ cinemaMode, setCinemaMode, video }} />
						) : (
							<div className="w-full aspect-video bg-secondary flex items-center justify-center rounded-lg">
								<DynamicIcon
									name="loader-2"
									className="animate-spin transition-all size-14 bg-black/60 rounded-full"
								/>
							</div>
						)}
						{!cinemaMode && (
							<div
								className="w-full flex flex-col gap-y-4"
								children={<LeftSidebar />}
							/>
						)}
					</div>
					{!cinemaMode && (
						<div
							className="w-full md:w-1/4 flex flex-col gap-y-2"
							children={<SideBar />}
						/>
					)}
				</section>

				{cinemaMode && (
					<section className="mx-auto flex flex-col gap-6 md:flex-row px-2 lg:px-8 pb-4">
						<div
							className="w-full md:w-3/4 flex flex-col gap-y-4"
							children={<LeftSidebar />}
						/>
						<div
							className="w-full md:w-1/4 flex flex-col gap-y-2"
							children={<SideBar />}
						/>
					</section>
				)}
			</HomeLayout>
		</>
	)
}
