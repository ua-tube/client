import { formatDuration, formatTimeAgo, getVideoUrl } from '@/utils'
import { IVideo } from '@/interfaces'
import Link from 'next/link'
import { FC } from 'react'


interface ISidebarVideoCardProps extends IVideo {
}

const SidebarVideoCard: FC<ISidebarVideoCardProps> = (value) => {

	return <div className="flex flex-row items-start gap-2.5">
		<Link
			href={getVideoUrl(value.id, undefined, true)}
			className="relative aspect-video w-2/5"
		>
			<img
				src={value.thumbnailUrl}
				className="block w-full h-full object-cover duration-200 rounded-lg"
				alt={value.id}
			/>
			<div
				className="absolute bottom-0.5 right-0.5 bg-background/80 text-secondary-foreground text-xs px-1 rounded"
				children={formatDuration(value.duration)}
			/>
		</Link>
		<div className="flex gap-x-2 w-3/5">
			<div className="flex flex-col">
				<Link
					href={getVideoUrl(value.id, undefined, true)}
					className="font-semibold text-base/4 line-clamp-2"
					children={value.title}
				/>
				<Link
					href={`/channel/${value.channel.id}`}
					className="text-muted-foreground text-xs"
				>
					<div children={value.channel.name} />
				</Link>

				<div
					className="text-muted-foreground text-xs"
					children={`${Intl.NumberFormat(undefined, {
						notation: 'compact'
					}).format(value.views)} переглядів • ${formatTimeAgo(value.postedAt)}`}
				/>
			</div>
		</div>
	</div>
}

export default SidebarVideoCard
