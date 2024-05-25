import { formatNumbers, formatTimeAgo, getChannelUrl } from '@/utils'
import { IVideo } from '@/interfaces'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
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
const ReportModal = dynamic(
	() => import('@/components/modals/ReportVideoModal')
)

interface IAboutVideoProps {
	video: IVideo
}

const AboutVideo: FC<IAboutVideoProps> = ({ video }) => {
	const [liked, setLiked] = useState<boolean>(false)
	const [disLiked, setDisLiked] = useState<boolean>(false)
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [openedTypeModal, setOpenedTypeModal] = useState<
		'playlists' | 'report' | 'share' | undefined
	>()

	const onLike = async () => {
		setLiked(s => !s)
		if (disLiked) setDisLiked(false)
	}

	const onDisLike = async () => {
		setDisLiked(s => !s)
		if (liked) setLiked(false)
	}

	const onSubscribe = async () => {
		setSubscribed(s => !s)
	}

	return (
		<div className='flex flex-col gap-y-4'>
			<h4
				className='scroll-m-20 text-2xl font-semibold tracking-tight'
				children={video.title}
			/>

			<div className='flex flex-col md:flex-row items-start md:items-center gap-y-5 gap-x-2 md:justify-between'>
				<div className='flex flex-row items-center space-x-3 w-full md:w-auto'>
					<Link href={getChannelUrl(video.creator.nickName)}>
						<Avatar>
							<AvatarImage src={video.creator.profileImg} />
							<AvatarFallback children={video.creator.name?.[0]} />
						</Avatar>
					</Link>
					<div className='flex flex-col'>
						<Link href={getChannelUrl(video.creator.nickName)}>
							<h5 className='font-semibold' children={video.creator.name} />
						</Link>
						<p
							className='font-light text-xs text-muted-foreground flex overflow-x-hidden truncate'
							children={`Підписалося ${formatNumbers(video.creator.subscribersCount || 0)} користувачів`}
						/>
					</div>
					<Button
						onClick={onSubscribe}
						variant={subscribed ? 'secondary' : 'default'}
						className='rounded-lg w-full md:w-auto'
						children={subscribed ? 'Відписатися' : 'Підписатися'}
					/>
				</div>

				<div className='flex flex-row items-center space-x-2 w-full md:w-auto'>
					<div className='flex items-center divide-x-2 divide-background'>
						<Button
							onClick={onLike}
							variant={liked ? 'default' : 'secondary'}
							className='rounded-l-lg rounded-r-none space-x-2'
						>
							<DynamicIcon name='thumbs-up' />
							<span children={formatNumbers(video.metrics?.likesCount)} />
						</Button>
						<Button
							onClick={onDisLike}
							variant={disLiked ? 'default' : 'secondary'}
							className='rounded-r-lg rounded-l-none space-x-2'
						>
							<DynamicIcon name='thumbs-down' />
							<span children={formatNumbers(video.metrics?.dislikesCount)} />
						</Button>
					</div>

					<Button
						variant='secondary'
						className='rounded-lg space-x-2'
						onClick={() => setOpenedTypeModal('share')}
					>
						<DynamicIcon name='share' />
						<span className='hiddenOnMobile' children='Поділитися' />
					</Button>

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
					<ReportModal
						video={video}
						open={openedTypeModal === 'report'}
						setOpen={v => setOpenedTypeModal(undefined)}
					/>

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
							<DropdownMenuItem onClick={() => setOpenedTypeModal('report')}>
								<div className='items-center flex space-x-2'>
									<DynamicIcon name='flag' />
									<span children='Поскаржитися' />
								</div>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>

			<Collapsible className='rounded-lg bg-secondary p-3 space-y-2'>
				<CollapsibleTrigger>
					<div className='flex items-center space-x-4 text-sm font-semibold'>
						<div children={`${formatNumbers(video.metrics?.viewsCount)} переглядів`} />
						<div children={formatTimeAgo(video.postedAt)} />
					</div>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<div
						dangerouslySetInnerHTML={{
							__html: video.description?.replace(/\n/g, '<br />') || ''
						}}
					/>
				</CollapsibleContent>
			</Collapsible>
		</div>
	)
}

export default AboutVideo
