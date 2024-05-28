import {
	formatNumbers,
	formatTimeAgo,
	getChannelUrl,
	getUserInitials,
	getVideoUrl,
	toastError
} from '@/utils'
import {
	HistoryService,
	LibraryService,
	SubscriptionsService
} from '@/services'
import { FC, useEffect, useState } from 'react'
import { IVideo, IVideoMetadataResponse } from '@/interfaces'
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
					const {
						data: { status }
					} = await SubscriptionsService.checkSubscription(video.creatorId!)
					const { data } = await LibraryService.getVideoMetadata(videoId)

					setVideoState(prevState => ({
						...prevState,
						...data,
						isSubscribed: status,
						isLiked: data.userVote === 'Like',
						isDisliked: data.userVote === 'Dislike'
					}))

					if (user) await HistoryService.createHistoryRecord({ videoId })
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
							<AvatarImage src={getVideoUrl(video?.creator?.thumbnailUrl)} />
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
							children={`Підписалося ${formatNumbers(video?.creator?.subscribersCount)} користувачів`}
						/>
					</div>
					<Button
						onClick={onSubscribe}
						variant={videoState.isSubscribed ? 'secondary' : 'default'}
						className='rounded-lg w-full md:w-auto'
						disabled={!user || user?.creator.id === video?.creatorId}
						children={videoState.isSubscribed ? 'Відписатися' : 'Підписатися'}
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
							<span children={formatNumbers(videoState.likesCount)} />
						</Button>
						<Button
							onClick={onDisLike}
							variant={videoState.isDisliked ? 'default' : 'secondary'}
							className='rounded-r-lg rounded-l-none space-x-2'
							disabled={!user}
						>
							<DynamicIcon name='thumbs-down' />
							<span children={formatNumbers(videoState.dislikesCount)} />
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
							<DropdownMenuItem onClick={() => setOpenedTypeModal('playlists')}>
								<div className='items-center flex space-x-2'>
									<DynamicIcon name='list-plus' />
									<span children='Зберегти' />
								</div>
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setOpenedTypeModal('share')}>
								<div className='items-center flex space-x-2'>
									<DynamicIcon name='share' />
									<span className='hiddenOnMobile' children='Поділитися' />
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<ShareVideoModal
						video={video}
						open={openedTypeModal === 'share'}
						setOpen={v => setOpenedTypeModal(undefined)}
					/>

					<PlaylistsModal
						video={video}
						open={openedTypeModal === 'playlists'}
						setOpen={v => setOpenedTypeModal(undefined)}
					/>
				</div>
			</div>

			<Collapsible className='rounded-lg bg-secondary p-3 space-y-2'>
				<CollapsibleTrigger>
					<div className='flex items-center space-x-4 text-sm font-semibold'>
						<div className='text-blue-400'>Натисніть, щоб відкрити</div>
						<div
							children={`${formatNumbers(videoState.viewsCount)} переглядів`}
						/>
						<div children={formatTimeAgo(video?.createdAt)} />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div
						dangerouslySetInnerHTML={{
							__html: video?.description?.replace(/\n/g, '<br />') || ''
						}}
					/>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default AboutVideo
