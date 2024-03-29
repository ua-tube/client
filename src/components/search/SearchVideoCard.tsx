import { getVideoUrl, formatDuration, getChannelUrl, formatNumbers, formatTimeAgo } from '@/utils'
import { Button, DynamicIcon } from '@/components'
import { VideoModalType } from './SearchContent'
import { IVideo, UseState } from '@/interfaces'
import Link from 'next/link'
import { FC } from 'react'


interface ISearchVideoCardProps {
	value: IVideo
	setModal: UseState<{ video: IVideo, type: VideoModalType } | undefined>
}

const SearchVideoCard: FC<ISearchVideoCardProps> = ({ value, setModal }) => {

	return <div
		className="flex flex-row items-start space-x-4 w-full hover:bg-primary-foreground p-2 rounded-lg group/item">
		<Link
			href={getVideoUrl(value.id, undefined, undefined, true)}
			className="relative aspect-video h-32"
		>
			<img
				src={value.thumbnailUrl}
				loading="lazy"
				className="block w-full h-full object-cover aspect-video duration-200 rounded-xl"
				alt={value.id}
			/>
			<div
				className="absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded"
				children={formatDuration(value.duration)}
			/>
		</Link>
		<div className="flex flex-col gap-y-1 w-3/6">
			<Link
				href={getVideoUrl(value.id, undefined, undefined, true)}
				className="font-semibold text-base xl:text-xl/6 line-clamp-2"
				children={value.title}
			/>
			<Link
				href={getChannelUrl(value.channel.nickName)}
				className="text-muted-foreground text-sm lg:text-base/2"
				children={value.channel.name}
			/>

			<div
				className="text-muted-foreground text-xs lg:text-sm"
				children={`${formatNumbers(value.views)} переглядів • ${formatTimeAgo(value.postedAt)}`}
			/>
		</div>
		<div className="space-x-2">
			<Button
				size="sm"
				variant="outline"
				onClick={() => setModal({ video: value, type: 'share' })}
				className="md:opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
				children={<DynamicIcon name="share" />}
			/>
			<Button
				size="sm"
				variant="outline"
				onClick={() =>setModal({ video: value, type: 'playlists' })}
				className="md:opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
				children={<DynamicIcon name="list-plus" />}
			/>
			<Button
				size="sm"
				variant="outline"
				onClick={() => setModal({ video: value, type: 'report' })}
				className="md:opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
				children={<DynamicIcon name="flag" />}
			/>
		</div>
	</div>

}

export default SearchVideoCard
