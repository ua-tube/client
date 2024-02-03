import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from '@/components'
import { IVideo } from '@/interfaces'
import { formatNumbers, formatTimeAgo } from '@/utils'
import { MoreHorizontal, Share, ThumbsDown, ThumbsUp } from 'lucide-react'
import { FC } from 'react'


interface IAboutVideoProps {
	video: IVideo
}

const AboutVideo: FC<IAboutVideoProps> = ({ video }) => {

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
				<Button className="rounded-lg w-full md:w-auto" children="Підписатися" />
			</div>

			<div className="flex flex-row items-center space-x-2 w-full md:w-auto">
				<div className="flex items-center divide-x-2 divide-background">
					<Button variant="secondary" className="rounded-l-lg rounded-r-none space-x-2">
						<ThumbsUp />
						<span children={formatNumbers(video.likesCount || 0)} />
					</Button>
					<Button variant="secondary" className="rounded-r-lg rounded-l-none space-x-2">
						<ThumbsDown />
						<span children={formatNumbers(video.disLikesCount || 0)} />
					</Button>
				</div>

				<Button variant="secondary" className="rounded-lg space-x-2">
					<Share />
					<span className="hiddenOnMobile" children="Поділитися" />
				</Button>
				<Button variant="secondary" className="rounded-lg w-full md:w-auto" children={<MoreHorizontal />} />
			</div>
		</div>


		<Collapsible className="rounded-lg bg-secondary p-3 space-y-2">
			<CollapsibleTrigger className="">
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
