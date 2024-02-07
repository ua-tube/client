import { IVideo } from '@/interfaces'
import VideoCard from './video-card'
import { FC } from 'react'

interface IVideosListProps {
	title?: string
	videos: IVideo[]
}

const VideosList: FC<IVideosListProps> = ({ videos, title }) => {
	return (<div className='space-y-4'>
			{title &&
				<h2
					className="scroll-m-20 text-2xl font-semibold tracking-tight first:mt-0"
					children={title}
				/>
			}
			<div
				className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4"
				children={videos.map((video: IVideo, index) => (
					<VideoCard key={index} {...video} />
				))}
			/>
		</div>
	)
}

export default VideosList
