import { Avatar, AvatarFallback, AvatarImage, Badge } from '@/components'
import { IComment } from '@/interfaces'
import { formatNumbers, formatTimeAgo } from '@/utils'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { FC } from 'react'

interface IVideoCommentsCardProps {
	comment: IComment
}

const VideoCommentsCard: FC<IVideoCommentsCardProps> = ({ comment }) => {

	return <div className="flex space-x-3">
		<Avatar>
			<AvatarImage src={comment.chanel.profileImageUrl} />
			<AvatarFallback className="uppercase" children={comment.chanel.name.slice(0, 2)} />
		</Avatar>
		<div className="flex flex-col gap-y-2">
			<div className="flex space-x-2 items-center">
				<Badge children={comment.chanel.name} variant="default" className='rounded-lg' />
				<div className="text-foreground text-xs" children={formatTimeAgo(comment.createdAt)} />
			</div>
			<div className="font-semibold" children={comment.message} />
			<div className="flex items-center space-x-2.5">
				<button
					className="flex space-x-1 items-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1">
					<ThumbsUp className="size-4" />
					<span children={formatNumbers(comment.likesCount)} />
				</button>
				<button className="flex space-x-1 items-center rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 px-2 py-1">
					<ThumbsDown className="size-4" />
					<span children={formatNumbers(comment.disLikesCount)} />
				</button>
			</div>

		</div>
	</div>

}

export default VideoCommentsCard
