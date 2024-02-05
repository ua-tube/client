import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
	Input
} from '@/components'
import { IVideo } from '@/interfaces'
import { formatNumbers, formatTimeAgo, getUrlForVideo } from '@/utils'
import { MoreHorizontal, Share, ThumbsDown, ThumbsUp } from 'lucide-react'
import { FC, useState } from 'react'


interface IAboutVideoProps {
	video: IVideo
}

const AboutVideo: FC<IAboutVideoProps> = ({ video }) => {
	const [liked, setLiked] = useState<boolean>(false)
	const [disLiked, setDisLiked] = useState<boolean>(false)
	const [subscribed, setSubscribed] = useState<boolean>(false)

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
						onClick={() => setLiked(s => !s)}
						variant={liked ? 'default' : 'secondary'}
						className="rounded-l-lg rounded-r-none space-x-2"
					>
						<ThumbsUp />
						<span children={formatNumbers(video.likesCount || 0)} />
					</Button>
					<Button
						onClick={() => setDisLiked(s => !s)}
						variant={disLiked ? 'default' : 'secondary'}
						className="rounded-r-lg rounded-l-none space-x-2"
					>
						<ThumbsDown />
						<span children={formatNumbers(video.disLikesCount || 0)} />
					</Button>
				</div>

				<HoverCard>
					<HoverCardTrigger asChild>
						<Button variant="secondary" className="rounded-lg space-x-2">
							<Share />
							<span className="hiddenOnMobile" children="Поділитися" />
						</Button>
					</HoverCardTrigger>
					<HoverCardContent side="top" className="w-80 space-y-2">
						<Input
							type="url"
							defaultValue={getUrlForVideo(video.id)}
							placeholder="Посилання на відео"
							disabled
						/>
						<Button
							className="rounded-lg space-x-2 w-full"
							children="Копіювати посилання"
						/>
					</HoverCardContent>
				</HoverCard>


				<Button variant="secondary" className="rounded-lg w-full md:w-auto" children={<MoreHorizontal />} />


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
