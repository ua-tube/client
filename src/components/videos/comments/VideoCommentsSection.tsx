import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	buttonVariants,
	Textarea
} from '@/components'
import {
	formatNumbers,
	getImageUrl,
	getUserInitials,
	toastError
} from '@/utils'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FC, useEffect, useState } from 'react'
import { IComment, IVideo } from '@/interfaces'
import { CommunityService } from '@/services'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks'
import { toast } from 'sonner'
import Link from 'next/link'

const VideoCommentsList = dynamic(() => import('./VideoCommentsList'))

interface IVideoCommentsSectionProps {
	videoId: string
	video?: IVideo
}

const VideoCommentsSection: FC<IVideoCommentsSectionProps> = ({
	videoId,
	video
}) => {
	const { t } = useTranslation('comments')
	const { locale } = useRouter()

	const { user } = useAuth()
	const [comment, setComment] = useState<string>('')

	const [comments, setComments] = useState<IComment[]>([])
	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState<boolean>(true)

	const onCommentSend = async () => {
		try {
			await CommunityService.createComment({ comment, videoId })
			toast.success(t('commentSuccSend'))
			setComment('')
		} catch (e) {
			toastError(e)
		}
	}

	const updateData = async () => {
		try {
			const { data: newComments } = await CommunityService.getCommentsByVideo(
				videoId,
				{ page, perPage: 10 }
			)

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
		;(async () => updateData())()
	}, [])

	return (
		<div className='flex flex-col gap-y-4'>
			<div className='flex flex-row items-center justify-between'>
				<h5 className='font-bold text-xl md:text-2xl'>
					{`${formatNumbers(video?.metrics?.commentsCount || 0, locale)} ${t('comments')}`}
				</h5>
			</div>
			<div className='flex flex-row gap-x-3'>
				<Avatar>
					<AvatarImage src={getImageUrl(user?.creator.thumbnailUrl)} />
					<AvatarFallback>
						{getUserInitials(user?.creator.displayName)}
					</AvatarFallback>
				</Avatar>
				<Textarea
					value={comment}
					onChange={e => setComment(e.target.value)}
					placeholder={t('writeYourComment')}
				/>
			</div>
			{comment && comment.length > 3 && (
				<>
					<Button onClick={onCommentSend} variant='secondary' disabled={!user}>
						{t('save')}
					</Button>
					{!user && (
						<Link
							href='/auth/sign-up'
							className={buttonVariants({ variant: 'outline' })}
						>
							{t('alreadyDontHaveAccount')}
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
