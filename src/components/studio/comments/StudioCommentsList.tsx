import StudioCommentCard from './StudioCommentCard'
import { IComment, IVideo, ILikedOrDislikedComment } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { CommunityService } from '@/services'
import { useAuth } from '@/hooks'

interface IStudioCommentsListProps {
	comments?: IComment[]
	video?: IVideo
	videoId: string
	updateData: () => Promise<void>
}

const StudioCommentsList: FC<IStudioCommentsListProps> = ({
	comments,
	video,
	videoId
}) => {
	const [commentsInfo, setCommentsInfo] = useState<ILikedOrDislikedComment[]>(
		[]
	)
	const { user } = useAuth()

	const updateData = async () => {
		try {
			if (user) {
				const { data } = await CommunityService.getCommentsVotesByVideo(videoId)
				setCommentsInfo([...data.dislikedCommentIds, ...data.likedCommentIds])
			}
		} catch (e) {}
	}

	useEffect(() => {
		;(async () => updateData())()
	}, [user, comments])

	return (
		<div className='flex flex-col gap-y-1 divide-y divide-secondary border-y border-secondary'>
			{comments?.map((value, index) => (
				<StudioCommentCard
					video={video}
					commentsInfo={commentsInfo}
					videoId={videoId}
					comment={value}
					key={index}
					updateData={updateData}
				/>
			))}
		</div>
	)
}

export default StudioCommentsList
