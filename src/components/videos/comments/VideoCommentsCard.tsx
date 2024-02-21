import { Avatar, AvatarFallback, AvatarImage, Badge, DynamicIcon, Input, Button } from '@/components'
import { formatTimeAgo } from '@/utils'
import { defaultChannel } from '@/data'
import { IComment } from '@/interfaces'
import { FC, useState } from 'react'

interface IVideoCommentsCardProps {
	comment: IComment
}

interface ICommentState extends IComment {
	isLiked: boolean
	isDisliked: boolean
}

interface IReplyState {
	inputMessage: string
	showInput: boolean
}

const VideoCommentsCard: FC<IVideoCommentsCardProps> = ({ comment }) => {
	const [commentState, setCommentState] = useState<ICommentState>({ ...comment, isDisliked: false, isLiked: false })
	const [replyState, setReplyState] = useState<IReplyState>({ inputMessage: '', showInput: false })

	const onLike = async () => {
		//TODO make action for comment like
		setCommentState(prevState => ({
			...prevState,
			likesCount: Math.abs(prevState.isLiked ? prevState.likesCount - 1 : prevState.likesCount + 1),
			isLiked: !prevState.isLiked,
			isDisliked: false
		}))
	}

	const onDislike = async () => {
		//TODO make action for comment dislike
		setCommentState(prevState => ({
			...prevState,
			likesCount: Math.abs(prevState.isLiked ? prevState.likesCount - 1 : prevState.likesCount),
			isLiked: false,
			isDisliked: !prevState.isDisliked
		}))
	}


	const onSendReply = async () => {
		//TODO make logic for reply action
		setReplyState(p => ({ ...p, showInput: false }))
		const newComment: IComment = {
			children: undefined,
			message: replyState.inputMessage,
			chanel: defaultChannel,
			createdAt: new Date().toISOString(),
			likesCount: 0,
			id: Math.random().toString()
		}
		setCommentState(p => ({ ...p, children: p.children ? [...p.children, newComment] : [newComment] }))
	}

	return <div>
		<div className="flex space-x-3">
			<Avatar>
				<AvatarImage src={commentState.chanel.profileImg} />
				<AvatarFallback
					className="uppercase"
					children={commentState.chanel.name.slice(0, 2)}
				/>
			</Avatar>
			<div className="flex flex-col gap-y-2">
				<div className="flex space-x-2 items-center">
					<Badge children={commentState.chanel.name} variant="default" className="rounded-lg" />
					<div className="text-foreground text-xs" children={formatTimeAgo(commentState.createdAt)} />
				</div>
				<div className="font-semibold" children={commentState.message} />
				<div className="flex items-center space-x-2.5">
					<Button
						size="sm"
						variant={commentState.isLiked ? 'default' : 'secondary'}
						className="flex space-x-1 items-center rounded-lg"
						onClick={onLike}
					>
						<DynamicIcon name="thumbs-up" className="size-4" />
						<span children={commentState.likesCount} />
					</Button>
					<Button
						onClick={onDislike}
						size="sm"
						variant={commentState.isDisliked ? 'default' : 'secondary'}
						className="flex space-x-1 items-center rounded-lg"
					>
						<DynamicIcon name="thumbs-down" className="size-4" />
					</Button>
					<Button
						onClick={() => setReplyState({ inputMessage: '', showInput: true })}
						className="flex space-x-1 items-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1">
						<DynamicIcon name="reply" className="size-4" />
						<span children="Відповісти" />
					</Button>
				</div>
				{replyState.showInput && <div className="flex items-center space-x-2">
					<Input
						placeholder="Ваша відповідь ..."
						type="text"
						value={replyState.inputMessage}
						onChange={e => setReplyState({ inputMessage: e.target.value, showInput: true })}
					/>
					<Button
						onClick={onSendReply}
						children={<DynamicIcon name="send-horizontal" />}
					/>
				</div>
				}
			</div>
		</div>
		{commentState.children &&
			commentState.children.length > 0 &&
			<div
				className="flex flex-col gap-y-2 pl-2 my-4 border-l border-muted"
				children={
					commentState.children.map((value, index) =>
						<VideoCommentsCard key={index} comment={value} />
					)}
			/>}
	</div>

}

export default VideoCommentsCard
