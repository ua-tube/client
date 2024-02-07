import {
	AboutVideo,
	AppHead,
	CategoryPills,
	SidebarVideoList,
	VideoCommentsSection,
	Skeleton,
	CurrentVideoPlaylist
} from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { categories, defaultComments, defaultVideo, playlists } from '@/data'
import { HomeLayout } from '@/components/layouts'
import dynamic from 'next/dynamic'
import { IPlaylist } from '@/interfaces'

const VideoPlayer = dynamic(
	() => import('@/components/videos/player'), {
		ssr: false,
		loading: () => <Skeleton className="aspect-video bg-secondary rounded-lg" />
	})

const defaultVideosIds: string[] = [
	'1b5a68680b00c658dc3dec16b5a27f0e',
	'85f080ed49cc2d52a1a4d1d252955e1d',
	'd6fe8454efd2c8253ead6ab79d34dddb',
	'6354c215a3c641a37ca7e4759da038ee',
	'361f18312f24eac5bf69f78189037d60',
	'f0e00bb2a86ff1cec67016b787634610',
	'9e040a7a6ef9df150ae9b5e3edf9429d',
	'dcfc673a421aa70e1ab78fda3b435d33',
	'3f7f8b78d7089f21d07331edce7fd0eb',
	'c417f3030e21e55c9013f4591035b795',
	'5d9d5bfa615733d9606ebc05e0df138b',
	'116281ab79cd0184d31c17b60e171bed'
]

export const getServerSideProps: GetServerSideProps<{
	videoId: string,
	nextVideoId: string,
	currList?: IPlaylist
}> = async ({ query }) => {

	let nextVideoId: string = defaultVideosIds.at(Math.floor(Math.random() * defaultVideosIds.length)) || ''
	let currList: IPlaylist | undefined
	const videoId = (query?.videoId as string) || ''

	if (query?.listId) {
		currList = playlists[0]
		const currVideoIndex = currList.videos!.findIndex(v => v.id === videoId)
		if (currList.videos)
			if (currList.videos.length > currVideoIndex + 1)
				nextVideoId = currList.videos?.[currVideoIndex + 1].id
			else
				nextVideoId = currList.videos?.[0].id
	}

	return {
		props: {
			videoId,
			nextVideoId,
			...(currList && { currList })
		}
	}
}

export default function VideoPage({
																		videoId, nextVideoId, currList
																	}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Перегляд відео ${videoId}`} />
			<HomeLayout hiddenSidebar autoHideSidebar>
				<section className="mx-auto flex flex-col gap-8 md:flex-row">
					<div className="w-full md:w-3/4 flex flex-col gap-y-4">
						<VideoPlayer
							videoId={videoId}
							nextVideoId={nextVideoId}
							qualities={defaultVideo?.qualities!}
							autoPlay
						/>
						<AboutVideo video={defaultVideo} />
						<VideoCommentsSection totalCount={4324} comments={defaultComments} />
					</div>
					<div className="w-full md:w-1/4 flex flex-col gap-y-2">
						{currList && <CurrentVideoPlaylist currList={currList} currVideoId={videoId} />}
						<CategoryPills categories={categories.slice(2)} />
						<SidebarVideoList />
					</div>
				</section>
			</HomeLayout>
		</>
	)
}
