import { IVideo } from '@/interfaces'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'

const SearchVideoCard = dynamic(() => import('./SearchVideoCard'))

const PlaylistsModal = dynamic(
	() => import('@/components/modals/PlaylistsModal')
)
const ShareModal = dynamic(() => import('@/components/modals/ShareVideoModal'))

export type VideoModalType = 'playlists' | 'share'

interface ISearchContentProps {
	videos: IVideo[]
}

const SearchContent: FC<ISearchContentProps> = ({ videos }) => {
	const [videoModal, setVideoModal] = useState<{
		video: IVideo
		type: VideoModalType
	}>()

	return (
		<div className="mx-auto max-w-5xl">

			<div
				className="flex flex-col gap-y-3"
				children={videos.map((value, index) => (
					<SearchVideoCard key={index} value={value} setModal={setVideoModal} />
				))}
			/>

			<PlaylistsModal
				video={videoModal?.video}
				open={videoModal?.type === 'playlists'}
				setOpen={v => setVideoModal(undefined)}
			/>

			<ShareModal
				video={videoModal?.video}
				open={videoModal?.type === 'share'}
				setOpen={v => setVideoModal(undefined)}
			/>
		</div>
	)
}

export default SearchContent
