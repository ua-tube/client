import { IVideo } from '@/interfaces'
import VideoCard from './video-card'
import { FC } from 'react'

interface IVideosListProps {
	videos: any[]
}

const VideosList: FC<IVideosListProps> = ({ videos }) => {
	return (
		<div
			className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"
			children={videos.map((video: IVideo, index) => (
				<VideoCard key={index} {...video} />
			))}
		/>
	)
}

export default VideosList
