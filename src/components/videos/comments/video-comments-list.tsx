import VideoCommentsCard from './video-comments-card'
import { IComment } from '@/interfaces'
import { FC } from 'react'

interface IVideoCommentsListProps {
	comments: IComment[]
}

const VideoCommentsList: FC<IVideoCommentsListProps> = ({ comments }) => {

	return <div
		className="flex flex-col gap-y-3"
		children={comments.map((value, index) =>
			<VideoCommentsCard key={index} comment={value} />
		)}
	/>

}

export default VideoCommentsList
