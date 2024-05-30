import {
	cn,
	formatDuration,
	formatNumbers,
	formatTimeAgo,
	getChannelUrl,
	getImageUrl,
	getUserInitials,
	getVideoUrl
} from '@/utils'
import { FC, useState } from 'react'
import { IVideo } from '@/interfaces'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components'

interface IVideoCardProps extends IVideo {
	fixedSize?: boolean
	className?: string
}

const VideoCard: FC<IVideoCardProps> = value => {
	const [hovered, setHovered] = useState<boolean>(false)

	return (
		<div
			className={cn(
				'flex flex-col gap-2 rounded-lg focus:bg-gray-100',
				value.fixedSize && ' w-64',
				value.className
			)}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<Link
				href={getVideoUrl(value.id, undefined, undefined, true)}
				className='relative aspect-video'
			>
				<img
					src={getImageUrl(
						value.previewThumbnailUrl && hovered
							? value.previewThumbnailUrl
							: value.thumbnailUrl
					)}
					loading='lazy'
					className='block w-full h-full object-cover aspect-video duration-200 rounded-xl'
					alt={value.id}
				/>
				<div
					className='absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded'
					children={formatDuration(value.lengthSeconds)}
				/>
			</Link>

			<div className='flex gap-x-2'>
				<Link
					href={getChannelUrl(value.creator?.nickname)}
					className='flex shrink-0'
				>
					<Avatar className='size-9'>
						<AvatarImage
							src={getImageUrl(value.creator?.thumbnailUrl)}
							loading='lazy'
						/>
						<AvatarFallback
							children={getUserInitials(value.creator?.displayName)}
						/>
					</Avatar>
				</Link>
				<div className='flex flex-col'>
					<Link
						href={getVideoUrl(value.id, undefined, undefined, true)}
						className={cn(
							'font-bold line-clamp-2',
							value.fixedSize && 'h-full max-w-52'
						)}
						children={value.title}
					/>
					<Link
						href={getChannelUrl(value.creator?.nickname)}
						className='text-muted-foreground text-sm'
						children={value.creator?.displayName}
					/>

					<div
						className='text-muted-foreground text-sm'
						children={`${formatNumbers(value.metrics?.viewsCount)} переглядів • ${formatTimeAgo(value.createdAt)}`}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoCard
