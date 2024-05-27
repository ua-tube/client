import { formatDuration, formatTimeAgo, getVideoUrl, getChannelUrl, formatNumbers } from '@/utils'
import { IVideo } from '@/interfaces'
import Link from 'next/link'
import { FC } from 'react'

interface ISidebarVideoCardProps extends IVideo {}

const SidebarVideoCard: FC<ISidebarVideoCardProps> = value => {
	return (
		<div className='flex flex-row items-start gap-2.5'>
			<Link
				href={getVideoUrl(value.id, undefined, undefined, true)}
				className='relative aspect-video w-2/5'
			>
				<img
					src={value.thumbnailUrl}
					loading='lazy'
					className='block w-full h-full object-cover duration-200 rounded-lg'
					alt={value.id}
				/>
				<div
					className='absolute bottom-0.5 right-0.5 bg-background/80 text-secondary-foreground text-xs px-1 rounded'
					children={formatDuration(value.lengthSeconds)}
				/>
			</Link>
			<div className='flex flex-col gap-x-2 w-3/5'>
				<Link
					href={getVideoUrl(value.id, undefined, undefined, true)}
					className='font-semibold text-base/4 line-clamp-2'
					children={value.title}
				/>
				<Link
					href={getChannelUrl(value.creator.nickname)}
					className='text-muted-foreground text-xs'
				>
					<div children={value.creator.displayName} />
				</Link>

				<div
					className='text-muted-foreground text-xs'
					children={`${formatNumbers(value.metrics?.viewsCount)} переглядів • ${formatTimeAgo(value.publishedAt)}`}
				/>
			</div>
		</div>
	)
}

export default SidebarVideoCard
