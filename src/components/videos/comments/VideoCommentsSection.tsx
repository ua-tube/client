import { Avatar, AvatarFallback, AvatarImage, Button, buttonVariants, Textarea } from '@/components'
import { getImageUrl, getUserInitials, toastError } from '@/utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FC, useState, useEffect } from 'react'
import { IComment, IVideo } from '@/interfaces'
import { CommunityService } from '@/services'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks'
import { toast } from 'sonner'
import Link from 'next/link'

const VideoCommentsList = dynamic(() => import('./VideoCommentsList'))

interface IVideoCommentsSectionProps {
	videoId: string
	video?: IVideo
}

const VideoCommentsSection: FC<
	IVideoCommentsSectionProps
> = ({
			 videoId,
			 video
		 }) => {
	const { user } = useAuth()
	const [comment, setComment] = useState<string>('')

	const [comments, setComments] = useState<IComment[]>([])
	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState<boolean>(true)

	const onCommentSend = async () => {
		try {
			await CommunityService.createComment({ comment, videoId })
			toast.success('Коментар додано незабаром він з’явиться на сайті!')
			setComment('')
		} catch (e) {
			toastError(e)
		}
	}

	const updateData = async () => {
		try {
			const { data: newComments } = await CommunityService.getCommentsByVideo(videoId, { page, perPage: 10 })

			if (newComments.some(v => comments.some(cv => cv.id === v.id))) {
				setHasMore(false)
			} else {
				setComments(p => [...p, ...newComments])
				setPage(p => p + 1)
				setHasMore(true)
			}
		} catch (e) {
			toastError(e)
		}
	}


	useEffect(() => {
		(async () => updateData())()
	}, [])


	return (
		<div className="flex flex-col gap-y-4">
			<div className="flex flex-row items-center justify-between">
				<h5 className="font-bold text-xl md:text-2xl">
					{`${video?.metrics?.commentsCount || 0} коментарів`}
				</h5>
			</div>
			<div className="flex flex-row gap-x-3">
				<Avatar>
					<AvatarImage src={getImageUrl(user?.creator.thumbnailUrl)} />
					<AvatarFallback>
						{getUserInitials(user?.creator.displayName)}
					</AvatarFallback>
				</Avatar>
				<Textarea
					value={comment}
					onChange={e => setComment(e.target.value)}
					placeholder="Напишіть ваш коментар..."
				/>
			</div>
			{comment && comment.length > 3 && (
				<>
					<Button onClick={onCommentSend} variant="secondary" disabled={!user}>
						Зберегти
					</Button>
					{!user && (
						<Link
							href="/auth/sign-up"
							className={buttonVariants({ variant: 'outline' })}
						>
							Досі не маєте аккаунту? Увійти/Зареєструватися
						</Link>
					)}
				</>
			)}
			<InfiniteScroll
				dataLength={comments.length}
				next={updateData}
				hasMore={hasMore}
				loader={<div></div>}
			>
				<VideoCommentsList {...{ videoId, comments }} />
			</InfiniteScroll>

		</div>
	)
}

export default VideoCommentsSection
