import { IPlaylist } from '@/interfaces'
import PlaylistCard from './PlaylistsCard'
import { FC } from 'react'

interface IPlaylistListProps {
	playlists: IPlaylist[]
}

const PlaylistList: FC<IPlaylistListProps> = ({ playlists }) => {
	return (
		<div
			className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2'
			children={playlists.map((value, index) => (
				<PlaylistCard key={index} playList={value} />
			))}
		/>
	)
}

export default PlaylistList
