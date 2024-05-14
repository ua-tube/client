import {
	categories,
	defaultVideo,
	playlists,
	videos,
	defaultComments
} from '@/data'
import { AppHead, Skeleton, DynamicIcon, AboutVideo } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { IPlaylist, IVideo } from '@/interfaces'
import { useState, FC } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/utils'

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
	video: IVideo
	videoIds: { next: string; prev?: string }
	currList?: IPlaylist
}> = async ({ query, locale }) => {
	const defaultVideosIds: string[] = videos.map(value => value.id)
	let videoIds: {
		next: string
		prev?: string
	} = {
		next:
			defaultVideosIds.at(
				Math.floor(Math.random() * defaultVideosIds.length)
			) || ''
	}
	let currList: IPlaylist | undefined
	const videoId = (query?.videoId as string) || ''
	let video = videos.find(value => value.id === videoId) || defaultVideo

	if (query?.listId) {
		currList =
			playlists.find(value => value.id == (query.listId as string)) ||
			playlists[0]
		const currVideoIndex = currList.videos!.findIndex(v => v.id === videoId)
		if (currList.videos) {
			videoIds.next =
				currList.videos.length > currVideoIndex + 1
					? currList.videos?.[currVideoIndex + 1].id
					: currList.videos?.[0].id
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
	const [cinemaMode, setCinemaMode] = useState(false)
	const SideBar: FC = () => (
		<>
			{currList && (
				<CurrentVideoPlaylist currList={currList} currVideoId={video.id} />
			)}
			<CategoryPills categories={categories.slice(2)} />
			<SidebarVideoList videos={videos} />
		</>
	)

	const LeftSidebar: FC = () => (
		<>
			<AboutVideo video={video} />
			<VideoCommentsSection totalCount={4324} comments={defaultComments} />
		</>
	)

	return (
		<>
			<AppHead title={video.title} image={video.thumbnailUrl} disableDesc />
			<HomeLayout disableBasePadding={cinemaMode} openInDrawer>
				<section className='mx-auto flex flex-col gap-6 md:flex-row pb-4'>
					<div
						className={cn(
							'flex flex-col gap-y-4 transform transition-transform duration-300',
							cinemaMode ? 'w-full' : 'md:w-3/4'
						)}
					>
						<VideoPlayer
							autoPlay
							{...{
								cinemaMode,
								setCinemaMode,
								video,
								videoIds
							}}
						/>
						{!cinemaMode && (
							<div
								className='w-full flex flex-col gap-y-4'
								children={<LeftSidebar />}
							/>
						)}
					</div>
					{!cinemaMode && (
						<div
							className='w-full md:w-1/4 flex flex-col gap-y-2'
							children={<SideBar />}
						/>
					)}
				</section>

				{cinemaMode && (
					<section className='mx-auto flex flex-col gap-6 md:flex-row px-2 lg:px-8 pb-4'>
						<div
							className='w-full md:w-3/4 flex flex-col gap-y-4'
							children={<LeftSidebar />}
						/>
						<div
							className='w-full md:w-1/4 flex flex-col gap-y-2'
							children={<SideBar />}
						/>
					</section>
				)}
			</HomeLayout>
		</>
	)
}
