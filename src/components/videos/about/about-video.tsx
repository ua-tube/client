import { formatNumbers, formatTimeAgo, getSourceVideoUrl, writeVideoUrl } from '@/utils'
import confetti from 'canvas-confetti'
import { IVideo } from '@/interfaces'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
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
	DynamicIcon,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Input
} from '@/components'

const PlaylistsModal = dynamic(() => import( './modals/playlists-modal'))
const ReportModal = dynamic(() => import( './modals/report-modal'))

interface IAboutVideoProps {
	video: IVideo
}

const AboutVideo: FC<IAboutVideoProps> = ({ video }) => {
	const [liked, setLiked] = useState<boolean>(false)
	const [disLiked, setDisLiked] = useState<boolean>(false)
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [openedTypeModal, setOpenedTypeModal] = useState<
		'playlists' |
		'report' |
		undefined
	>(undefined)

	const onLike = () => {
		setLiked(s => !s)
		if (disLiked) setDisLiked(false)
	}

	const onDisLike = () => {
		setDisLiked(s => !s)
		if (liked) setLiked(false)
	}

	const onCopyLinkPress = async () => {
		await writeVideoUrl(video.id)
		Array(10).fill(null).forEach((_, index) => confetti({
			particleCount: 200,
			startVelocity: 30,
			spread: 360,
			origin: { x: Math.random(), y: Math.random() - 0.2 }
		}))
	}

	return <div className="flex flex-col gap-y-4">
		<h4 className="scroll-m-20 text-2xl font-semibold tracking-tight" children={video.title} />

		<div className="flex flex-col md:flex-row items-start md:items-center gap-y-5 gap-x-2 md:justify-between">
			<div className="flex flex-row items-center space-x-3 w-full md:w-auto">
				<Avatar>
					<AvatarImage src={video.channel.profileImageUrl} />
					<AvatarFallback children={video.channel.name?.[0]} />
				</Avatar>
				<div className="flex flex-col">
					<h5 className="font-semibold" children={video.channel.name} />
					<p
						className="font-light text-xs text-muted-foreground flex overflow-x-hidden truncate"
						children={`Підписалося ${formatNumbers(video.channel.subscribersCount || 0)} користувачів`} />
				</div>
				<Button
					onClick={() => setSubscribed(s => !s)}
					variant={subscribed ? 'secondary' : 'default'}
					className="rounded-lg w-full md:w-auto"
					children={subscribed ? 'Відписатися' : 'Підписатися'}
				/>
			</div>

			<div className="flex flex-row items-center space-x-2 w-full md:w-auto">
				<div className="flex items-center divide-x-2 divide-background">
					<Button
						onClick={onLike}
						variant={liked ? 'default' : 'secondary'}
						className="rounded-l-lg rounded-r-none space-x-2"
					>
						<DynamicIcon name="thumbs-up" />
						<span children={formatNumbers(video.likesCount || 0)} />
					</Button>
					<Button
						onClick={onDisLike}
						variant={disLiked ? 'default' : 'secondary'}
						className="rounded-r-lg rounded-l-none space-x-2"
					>
						<DynamicIcon name="thumbs-down" />
						<span children={formatNumbers(video.disLikesCount || 0)} />
					</Button>
				</div>

				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant="secondary" className="rounded-lg space-x-2">
							<DynamicIcon name="share" />
							<span className="hiddenOnMobile" children="Поділитися" />
						</Button>
					</HoverCardTrigger>
					<HoverCardContent className="w-80 space-y-2">
						<Input
							type="url"
							defaultValue={getSourceVideoUrl(video.id)}
							placeholder="Посилання на відео"
							disabled
						/>
						<Button
							className="rounded-lg space-x-2 w-full"
							children="Копіювати посилання"
							onClick={onCopyLinkPress}
						/>
					</HoverCardContent>
				</HoverCard>

				<PlaylistsModal
					video={video}
					open={openedTypeModal === 'playlists'}
					setOpen={(v) => setOpenedTypeModal(undefined)}
				/>
				<ReportModal
					video={video}
					open={openedTypeModal === 'report'}
					setOpen={(v) => setOpenedTypeModal(undefined)}
				/>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="secondary"
							className="rounded-lg w-full md:w-auto"
							children={<DynamicIcon name="more-horizontal" />}
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem onClick={() => setOpenedTypeModal('playlists')}>
							<div className="items-center flex space-x-2">
								<DynamicIcon name="list-plus" />
								<span children="Зберегти" />
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setOpenedTypeModal('report')}>
							<div className="items-center flex space-x-2">
								<DynamicIcon name="flag" />
								<span children="Поскаржитися" />
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>


			</div>
		</div>

		<Collapsible className="rounded-lg bg-secondary p-3 space-y-2">
			<CollapsibleTrigger>
				<div className="flex items-center space-x-4 text-sm font-semibold">
					<div children={`${formatNumbers(video.views)} переглядів`} />
					<div children={formatTimeAgo(video.postedAt)} />
				</div>
			</CollapsibleTrigger>
			<CollapsibleContent>
				<div dangerouslySetInnerHTML={{
					__html: video.description?.replace(/\n/g, '<br />') || ''
				}} />
			</CollapsibleContent>
		</Collapsible>

	</div>

}

export default AboutVideo
