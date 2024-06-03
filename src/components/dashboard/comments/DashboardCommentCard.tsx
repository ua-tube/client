import { Avatar, AvatarImage, AvatarFallback, Badge, Button, DynamicIcon, Input } from '@/components'
import { formatTimeAgo, getVideoUrl, toastError, getImageUrl, getUserInitials } from '@/utils'
import { IComment, IVideo, ILikedOrDislikedComment } from '@/interfaces'
import { CommunityService } from '@/services'
import { FC, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

interface IDashboardCommentCardProps {
	comment: IComment
	updateData: () => Promise<void>
	commentsInfo: ILikedOrDislikedComment[]
	video?: IVideo
	videoId: string
	parentComment?: IComment
}

interface IReplyState {
	inputMessage: string
	showInput: boolean
}

const DashboardCommentCard: FC<
	IDashboardCommentCardProps
> = ({
			 comment,
			 video,
			 videoId,
			 parentComment,
			 commentsInfo,
			 updateData
		 }) => {

	const isDisliked = commentsInfo.some(
		v => v.videoCommentId === comment.id && v.type === 'Dislike'
	)
	const isLiked = commentsInfo.some(
		v => v.videoCommentId === comment.id && v.type === 'Like'
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
			await updateData()
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
			await updateData()
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
			<div className="flex flex-row justify-between items-center py-2">
				<div className="flex space-x-3">
					<Avatar>
						<AvatarImage src={getImageUrl(comment.creator.thumbnailUrl)} />
						<AvatarFallback
							className="uppercase"
							children={getUserInitials(comment.creator.displayName)}
						/>
					</Avatar>
					<div className="flex flex-col gap-y-2">
						<div className="flex space-x-2 items-center">
							<Badge
								children={comment.creator.displayName}
								variant="default"
								className="rounded-lg"
							/>
							<div
								className="text-foreground text-xs"
								children={formatTimeAgo(comment.createdAt)}
							/>
						</div>
						<div className="font-semibold" children={comment.comment} />
						<div className="flex items-center space-x-2.5">
							<Button
								size="sm"
								variant={isLiked ? 'default' : 'secondary'}
								className="flex space-x-1 items-center rounded-lg"
								onClick={onLike}
							>
								<DynamicIcon name="thumbs-up" className="size-4" />
								<span children={isLiked ? comment.likesCount + 1 : comment.likesCount} />
							</Button>
							<Button
								onClick={onDislike}
								size="sm"
								variant={isDisliked ? 'default' : 'secondary'}
								className="flex space-x-1 items-center rounded-lg"
							>
								<DynamicIcon name="thumbs-down" className="size-4" />
							</Button>
							<Button
								onClick={() =>
									setReplyState(p => ({
										inputMessage: '',
										showInput: !p.showInput
									}))
								}
								className="flex space-x-1 items-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1"
							>
								<DynamicIcon name="reply" className="size-4" />
								<span children="Відповісти" />
							</Button>
						</div>
						{replyState.showInput && (
							<div className="flex items-center space-x-2">
								<Input
									placeholder="Ваша відповідь ..."
									type="text"
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
									children={<DynamicIcon name="send-horizontal" />}
								/>
							</div>
						)}
					</div>
				</div>

				{video && (
					<Link
						href={getVideoUrl(videoId, undefined, undefined, true)}
						target="_blank"
						className="flex flex-row items-center space-x-2 px-4"
					>
						<img
							src={getImageUrl(video.thumbnailUrl)}
							alt={videoId}
							className="h-20 w-auto rounded-lg aspect-video object-cover"
						/>
						<div
							className="line-clamp-3 w-36 text-sm hover:underline"
							children={video.title}
						/>
						<DynamicIcon name="share-2" className="size-3" />
					</Link>
				)}
			</div>
			{comment.replies && comment.replies.length > 0 && (
				<div
					className="flex flex-col gap-y-2 pl-6 my-4 border-l border-muted"
					children={comment.replies.map((value, key) => (
						<DashboardCommentCard
							{...{
								comment: value,
								key,
								parentComment: comment,
								videoId,
								video,
								updateData,
								commentsInfo
							}}
						/>
					))}
				/>
			)}
		</div>
	)
}

export default DashboardCommentCard
