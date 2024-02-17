import { IComment } from '@/interfaces'
import { FC, useState } from 'react'
import { videos, defaultChannel } from '@/data'
import { Avatar, AvatarImage, AvatarFallback, Badge, Button, DynamicIcon, Input } from '@/components'
import { formatTimeAgo, getVideoUrl } from '@/utils'
import Link from 'next/link'


interface IDashboardCommentCardProps {
	comment: IComment
}

interface IReplyState {
	inputMessage: string
	showInput: boolean
}

interface ICommentState extends IComment {
	isLiked: boolean
	isDisliked: boolean
}

const DashboardCommentCard: FC<IDashboardCommentCardProps> = ({ comment }) => {
	const currVideo = videos[0]
	const [replyState, setReplyState] = useState<IReplyState>({ inputMessage: '', showInput: false })
	const [commentState, setCommentState] = useState<ICommentState>({ ...comment, isDisliked: false, isLiked: false })

	const onSendReply = async () => {
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

	const onDislike = async () => {
		setCommentState(prevState => ({
			...prevState,
			likesCount: Math.abs(prevState.isLiked ? prevState.likesCount - 1 : prevState.likesCount),
			isLiked: false,
			isDisliked: !prevState.isDisliked
		}))
	}


	const onLike = async () => {
		setCommentState(prevState => ({
			...prevState,
			likesCount: Math.abs(prevState.isLiked ? prevState.likesCount - 1 : prevState.likesCount + 1),
			isLiked: !prevState.isLiked,
			isDisliked: false
		}))
	}
	const onLikeFromChannel = async () => {}

	const onDelete = async () => {}

	return <div>
		<div
			className="flex flex-row justify-between items-center py-2"
		>
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
							size="sm"
							variant='secondary'
							onClick={onLikeFromChannel}
							className="flex space-x-1 items-center rounded-lg"
						>
							<DynamicIcon name="heart" className="size-4" />
						</Button>
						<Button
							size="sm"
							variant='destructive'
							onClick={onDelete}
							className="flex space-x-1 items-center rounded-lg"
						>
							<DynamicIcon name="trash" className="size-4" />
						</Button>
						<Button
							onClick={() => setReplyState(p => ({ inputMessage: '', showInput: !p.showInput }))}
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

			<Link
				href={getVideoUrl(currVideo.id, undefined, undefined, true)}
				target="_blank"
				className="flex flex-row items-center space-x-2 px-4">
				<img
					src={currVideo.thumbnailUrl}
					alt={currVideo.id}
					className="h-20 w-auto aspect-video object-cover"
				/>
				<div
					className="line-clamp-3 w-36 text-sm hover:underline"
					children={currVideo.title}
				/>
				<DynamicIcon name="share-2" className="size-3" />
			</Link>

		</div>
		{commentState.children && commentState.children.length > 0 &&
			<div
				className="flex flex-col gap-y-2 pl-6 my-4 border-l border-muted"
				children={
					commentState.children.map((value, index) =>
						<DashboardCommentCard key={index} comment={value} />
					)}
			/>}
	</div>

}

export default DashboardCommentCard
