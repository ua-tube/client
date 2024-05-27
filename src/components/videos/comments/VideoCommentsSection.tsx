import { Avatar, AvatarFallback, AvatarImage, Textarea, Button } from '@/components'
import { getImageUrl, getUserInitials, toastError } from '@/utils'
import { IComment, IPagination, IVideo } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { CommunityService } from '@/services'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks'
import { toast } from 'sonner'

const VideoCommentsList = dynamic(() => import('./VideoCommentsList'))

interface IVideoCommentsSectionProps {
	videoId: string
	video?: IVideo
}

const VideoCommentsSection: FC<IVideoCommentsSectionProps> = ({ videoId, video }) => {
	const { user } = useAuth()
	const [comment, setComment] = useState<string>('')
	const [comments, setComments] = useState<IComment[]>([])
	const [params, setParams] = useState<IPagination>({ page: 1, perPage: 2 })
	const [hasMore, setHasMore] = useState<boolean>()

	const updateData = async (newParams?: IPagination) => {
		try {
			const { data: newComments } = await CommunityService.getCommentsByVideo(videoId, newParams || params)
			const currComments = [...comments, ...newComments]
			setHasMore(currComments.length !== comments.length)
			setComments(currComments)
		} catch (e) {
			toastError(e)
		}
	}

	const onCommentSend = async () => {
		try {
			await CommunityService.createComment({ comment, videoId })
			toast.success('Коментар додано незабаром він з’явиться на сайті!')
			setComment('')
			await updateData()
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		(async () => updateData())()
	}, [params])

	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-row items-center justify-between">
				<h5 className="font-bold text-xl md:text-2xl">
					{`${video?.metrics?.commentsCount || comments.length || 0} коментарів`}
				</h5>
			</div>
			<div className="flex flex-row gap-x-3">
				<Avatar>
					<AvatarImage src={getImageUrl(user?.creator.thumbnailUrl)} />
					<AvatarFallback>{getUserInitials(user?.creator.displayName)}</AvatarFallback>
				</Avatar>
				<Textarea
					value={comment}
					onChange={(e) => setComment(e.target.value)}
					placeholder="Напишіть ваш коментар..."
				/>
			</div>
			{comment && comment.length > 3 && (
				<Button onClick={onCommentSend} variant="secondary">
					Зберегти
				</Button>
			)}
			<VideoCommentsList {...{ videoId, comments, updateData }} />
			{hasMore &&
				<Button
					variant="secondary"
					onClick={() => setParams(
						(prevParams) =>
							({ ...prevParams, page: +prevParams.page + 1 })
					)}
				>
					Заватажити ще
				</Button>
			}


		</div>
	)
}

export default VideoCommentsSection
