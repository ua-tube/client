import { Avatar, AvatarFallback, AvatarImage, Badge, DynamicIcon, Input, Button } from '@/components'
import { formatTimeAgo, getImageUrl, getUserInitials, toastError } from '@/utils'
import { IComment, ILikedOrDislikedComment } from '@/interfaces'
import { CommunityService } from '@/services'
import { FC, useState } from 'react'
import { useAuth } from '@/hooks'
import { toast } from 'sonner'

interface IVideoCommentCardProps {
	comment: IComment
	parentComment?: IComment
	videoId: string
	commentsInfo: ILikedOrDislikedComment[]
}

interface IReplyState {
	inputMessage: string
	showInput: boolean
}

const VideoCommentCard: FC<IVideoCommentCardProps> = ({
	comment,
	videoId,
	parentComment,
	commentsInfo
}) => {
	const { user } = useAuth()

	const isLiked = commentsInfo.some(
		v => v.videoCommentId === comment.id && v.type === 'Like'
	)
	const isDisliked = commentsInfo.some(
		v => v.videoCommentId === comment.id && v.type === 'Dislike'
	)

	const [replyState, setReplyState] = useState<IReplyState>({
		inputMessage: '',
		showInput: false
	})

	const onLike = async () => {
		try {
			await CommunityService.commentVote({
				commentId: comment.id,
				videoId,
				voteType: !isLiked ? 'Like' : 'None'
			})
		} catch (e) {
			toastError(e)
		}
	}

	const onDislike = async () => {
		try {
			await CommunityService.commentVote({
				commentId: comment.id,
				videoId,
				voteType: !isDisliked ? 'Dislike' : 'None'
			})
		} catch (e) {
			toastError(e)
		}
	}

	const onSendReply = async () => {
		try {
			await CommunityService.createCommentReply({
				videoId,
				comment: replyState.inputMessage,
				parentCommentId: parentComment?.id || comment.id
			})
			setReplyState({ inputMessage: '', showInput: false })
			toast.success('Відповідь успішно надіслано! Незабаром він зявиться на сайті!')
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<div>
			<div className='flex space-x-3'>
				<Avatar>
					<AvatarImage src={getImageUrl(comment.creator.thumbnailUrl)} />
					<AvatarFallback
						className='uppercase'
						children={getUserInitials(comment.creator.displayName)}
					/>
				</Avatar>
				<div className='flex flex-col gap-y-2'>
					<div className='flex space-x-2 items-center'>
						<Badge
							children={comment.creator.displayName}
							variant='default'
							className='rounded-lg'
						/>
						<div
							className='text-foreground text-xs'
							children={formatTimeAgo(comment.createdAt)}
						/>
					</div>
					<div className='font-semibold' children={comment.comment} />
					{user ? (
						<div className='flex items-center space-x-2.5'>
							<Button
								size='sm'
								variant={isLiked ? 'default' : 'secondary'}
								className='flex space-x-1 items-center rounded-lg'
								onClick={onLike}
							>
								<DynamicIcon name='thumbs-up' className='size-4' />
								<span children={comment.likesCount} />
							</Button>
							<Button
								onClick={onDislike}
								size='sm'
								variant={isDisliked ? 'default' : 'secondary'}
								className='flex space-x-1 items-center rounded-lg'
							>
								<DynamicIcon name='thumbs-down' className='size-4' />
							</Button>

							<Button
								onClick={() =>
									setReplyState({ inputMessage: '', showInput: true })
								}
								className='flex space-x-1 items-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1'
							>
								<DynamicIcon name='reply' className='size-4' />
								<span children='Відповісти' />
							</Button>
						</div>
					) : (
						<div className='border-accent border-b-2 w-full' />
					)}
					{replyState.showInput && (
						<div className='flex items-center space-x-2'>
							<Input
								placeholder='Ваша відповідь ...'
								type='text'
								value={replyState.inputMessage}
								onChange={e =>
									setReplyState({
										inputMessage: e.target.value,
										showInput: true
									})
								}
							/>
							<Button
								onClick={onSendReply}
								children={<DynamicIcon name='send-horizontal' />}
							/>
						</div>
					)}
				</div>
			</div>
			{comment.replies && comment.replies.length > 0 && (
				<div
					className='flex flex-col gap-y-2 pl-3 my-4 border-l-4 border-primary'
					children={comment.replies.map((value, key) => (
						<VideoCommentCard
							{...{
								comment: value,
								videoId,
								key,
								parentComment: comment,
								commentsInfo
							}}
						/>
					))}
				/>
			)}
		</div>
	)
}

export default VideoCommentCard
