import { FC } from 'react'
import VideoCard from './video-card'

interface IVideosListProps {
	videos: any[]
}

const VideosList: FC<IVideosListProps> = ({ videos }) => {
	return (
		<div
			className='grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4'
			children={videos.map(video => (
				<VideoCard key={video.id} {...video} />
			))}
		/>
	)
}

export default VideosList
