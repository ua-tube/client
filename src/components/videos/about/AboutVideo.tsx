import {
	formatNumbers,
	formatTimeAgo,
	getChannelUrl,
	getUserInitials,
	toastError,
	getImageUrl
} from '@/utils'
import { LibraryService, SubscriptionsService } from '@/services'
import { IVideo, IVideoMetadataResponse } from '@/interfaces'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks'
import Link from 'next/link'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DynamicIcon
} from '@/components'

const ShareVideoModal = dynamic(
	() => import('@/components/modals/ShareVideoModal')
)
const PlaylistsModal = dynamic(
	() => import('@/components/modals/PlaylistsModal')
)

interface IAboutVideoProps {
	videoId: string
	video?: IVideo
}

interface IVideoState extends IVideoMetadataResponse {
	isLiked: boolean
	isDisliked: boolean
	isSubscribed: boolean
}

const AboutVideo: FC<IAboutVideoProps> = ({ video, videoId }) => {
	const { t } = useTranslation('videos')
	const { locale } = useRouter()

	const { user } = useAuth()

	const [videoState, setVideoState] = useState<IVideoState>({
		isDisliked: false,
		isLiked: false,
		likesCount: '0',
		viewsCount: '0',
		isSubscribed: false,
		userVote: 'None',
		dislikesCount: '0'
	})

	const [openedTypeModal, setOpenedTypeModal] = useState<
		'playlists' | 'share' | undefined
	>()

	const onLike = async () => {
		try {
			await LibraryService.videoLikeOrDislike({
				videoId,
				voteType: videoState.isLiked ? 'None' : 'Like'
			})
			setVideoState(prevState => ({
				...prevState,
				isLiked: !prevState.isLiked,
				isDisliked: prevState.isLiked ? prevState.isDisliked : false,
				userVote: prevState.isLiked ? 'None' : 'Like',
				likesCount: prevState.isLiked
					? (parseInt(prevState.likesCount) - 1).toString()
					: (parseInt(prevState.likesCount) + 1).toString(),
				dislikesCount: prevState.isLiked
					? prevState.dislikesCount
					: prevState.isDisliked
						? (parseInt(prevState.dislikesCount) - 1).toString()
						: prevState.dislikesCount
			}))
		} catch (e) {
			toastError(e)
		}
	}

	const onDisLike = async () => {
		try {
			await LibraryService.videoLikeOrDislike({
				videoId,
				voteType: videoState.isDisliked ? 'None' : 'Dislike'
			})
			setVideoState(prevState => ({
				...prevState,
				isLiked: prevState.isDisliked ? prevState.isLiked : false,
				isDisliked: !prevState.isDisliked,
				userVote: prevState.isDisliked ? 'None' : 'Dislike',
				likesCount: prevState.isDisliked
					? prevState.likesCount
					: prevState.isLiked
						? (parseInt(prevState.likesCount) - 1).toString()
						: prevState.likesCount,
				dislikesCount: prevState.isDisliked
					? (parseInt(prevState.dislikesCount) - 1).toString()
					: (parseInt(prevState.dislikesCount) + 1).toString()
			}))
		} catch (e) {
			toastError(e)
		}
	}

	const onSubscribe = async () => {
		try {
			if (video?.creatorId) {
				if (videoState.isSubscribed) {
					await SubscriptionsService.unsubscribe({ targetId: video.creatorId })
				} else {
					await SubscriptionsService.subscribe({ targetId: video.creatorId })
				}
			}
			setVideoState(prevState => ({
				...prevState,
				isSubscribed: !prevState.isSubscribed
			}))
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		;(async () => {
			if (video) {
				try {
					let isSubscribed = false
					if (user) {
						const {
							data: { status }
						} = await SubscriptionsService.checkSubscription(video.creatorId!)
						isSubscribed = status
					}

					const { data } = await LibraryService.getVideoMetadata(videoId)

					setVideoState(prevState => ({
						...prevState,
						isSubscribed,
						viewsCount:
							video.metrics?.viewsCount ||
							data.viewsCount ||
							prevState.viewsCount,
						likesCount: data.likesCount || prevState.likesCount,
						dislikesCount: data.dislikesCount || prevState.dislikesCount,
						isLiked: data.userVote === 'Like',
						isDisliked: data.userVote === 'Dislike'
					}))
				} catch (e) {
					toastError(e)
				}
			}
		})()
	}, [video])

	return (
		<div className='flex flex-col gap-y-4'>
			<h4
				className='scroll-m-20 text-2xl font-semibold tracking-tight'
				children={video?.title}
			/>

			<div className='flex flex-col md:flex-row items-start md:items-center gap-y-5 gap-x-2 md:justify-between'>
				<div className='flex flex-row items-center space-x-3 w-full md:w-auto'>
					<Link href={getChannelUrl(video?.creator?.nickname)}>
						<Avatar>
							<AvatarImage src={getImageUrl(video?.creator?.thumbnailUrl)} />
							<AvatarFallback
								children={getUserInitials(video?.creator?.displayName)}
							/>
						</Avatar>
					</Link>
					<div className='flex flex-col'>
						<Link href={getChannelUrl(video?.creator?.nickname)}>
							<h5
								className='font-semibold'
								children={video?.creator?.displayName}
							/>
						</Link>
						<p
							className='font-light text-xs text-muted-foreground flex overflow-x-hidden truncate'
							children={t('usersSubscribed', {
								usersCount: formatNumbers(
									video?.creator?.subscribersCount,
									locale
								)
							})}
						/>
					</div>
					<Button
						onClick={onSubscribe}
						variant={videoState.isSubscribed ? 'secondary' : 'default'}
						className='rounded-lg w-full md:w-auto'
						disabled={!user || user?.creator.id === video?.creatorId}
						children={t(videoState.isSubscribed ? 'unsubscribe' : 'subscribe')}
					/>
				</div>

				<div className='flex flex-row items-center space-x-2 w-full md:w-auto'>
					<div className='flex items-center divide-x-2 divide-background'>
						<Button
							onClick={onLike}
							variant={videoState.isLiked ? 'default' : 'secondary'}
							className='rounded-l-lg rounded-r-none space-x-2'
							disabled={!user}
						>
							<DynamicIcon name='thumbs-up' />
							<span children={formatNumbers(videoState.likesCount, locale)} />
						</Button>
						<Button
							onClick={onDisLike}
							variant={videoState.isDisliked ? 'default' : 'secondary'}
							className='rounded-r-lg rounded-l-none space-x-2'
							disabled={!user}
						>
							<DynamicIcon name='thumbs-down' />
							<span
								children={formatNumbers(videoState.dislikesCount, locale)}
							/>
						</Button>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='secondary'
								className='rounded-lg w-full md:w-auto'
								children={<DynamicIcon name='more-horizontal' />}
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								disabled={!user}
								onClick={() => setOpenedTypeModal('playlists')}
							>
								<div className='items-center flex space-x-2'>
									<DynamicIcon name='list-plus' />
									<span children={t('save')} />
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setOpenedTypeModal('share')}>
								<div className='items-center flex space-x-2'>
									<DynamicIcon name='share' />
									<span children={t('share')} />
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<ShareVideoModal
						video={video}
						open={openedTypeModal === 'share'}
						setOpen={() => setOpenedTypeModal(undefined)}
					/>

					<PlaylistsModal
						video={video}
						open={openedTypeModal === 'playlists'}
						setOpen={() => setOpenedTypeModal(undefined)}
					/>
				</div>
			</div>

			<Collapsible className='rounded-lg bg-secondary p-3 space-y-2'>
				<CollapsibleTrigger>
					<div className='flex items-center space-x-4 text-sm font-semibold'>
						{video?.description && video.description.length > 0 && (
							<div className='text-blue-400'>{t('clickForOpen')}</div>
						)}

						<div
							children={`${formatNumbers(video?.metrics?.viewsCount, locale)} ${t('views')}`}
						/>
						<div children={formatTimeAgo(video?.createdAt, locale)} />
					</div>
				</CollapsibleTrigger>
				{video?.description && video.description.length > 0 && (
					<CollapsibleContent>
						<div
							dangerouslySetInnerHTML={{
								__html: video?.description?.replace(/\n/g, '<br />') || ''
							}}
						/>
					</CollapsibleContent>
				)}
			</Collapsible>
		</div>
	)
}

export default AboutVideo
