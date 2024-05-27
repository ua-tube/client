import { IComment, ILikedOrDislikedComment } from '@/interfaces'
import VideoCommentCard from './VideoCommentCard'
import { FC, useState, useEffect } from 'react'
import { CommunityService } from '@/services'
import { useAuth } from '@/hooks'

interface IVideoCommentsListProps {
	comments: IComment[]
	videoId: string
	updateData: () => void
}

const VideoCommentsList: FC<IVideoCommentsListProps> = ({ comments, videoId, updateData }) => {
	const { user } = useAuth()
	const [commentsInfo, setCommentsInfo] = useState<ILikedOrDislikedComment[]>([])

	useEffect(() => {
		(async () => {
			if (user) {
				const { data } = await CommunityService.getCommentsVotesByVideo(videoId)
				setCommentsInfo([...data.dislikedCommentIds, ...data.likedCommentIds])
			}
		})()
	}, [user, comments])


	return (
		<div
			className="flex flex-col gap-y-3"
			children={comments.map((comment, key) => (
				<VideoCommentCard {...{ comment, videoId, updateData, key, commentsInfo }} />
			))}
		/>
	)
}

export default VideoCommentsList
