import { formatDuration, formatTimeAgo, getVideoUrl, getChannelUrl, cn, getUserInitials, formatNumbers } from '@/utils'
import { FC, useEffect, useRef, useState } from 'react'
import { IVideo } from '@/interfaces'
import Link from 'next/link'
import { Avatar, AvatarImage, AvatarFallback } from '@/components'

interface IVideoCardProps extends IVideo {
	fixedSize?: boolean
	className?: string
}

const VideoCard: FC<IVideoCardProps> = value => {
	const [timeout, setModalTimeout] = useState<any>(null)
	const [isVideoPlaying, setIsVideoPlaying] = useState(false)
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (videoRef.current === null) return
		if (isVideoPlaying) {
			videoRef.current.currentTime = 0
			videoRef.current.play().catch()
		} else videoRef.current.pause()
	}, [isVideoPlaying])

	return (
		<div
			className={cn(
				'flex flex-col gap-2 rounded-lg focus:bg-gray-100',
				value.fixedSize && ' w-64',
				value.className
			)}
			onMouseEnter={() => {
				timeout && !isVideoPlaying && clearTimeout(timeout)
				setModalTimeout(setTimeout(() => setIsVideoPlaying(true), 1000))
			}}
			onMouseLeave={() => {
				timeout && clearTimeout(timeout)
				setIsVideoPlaying(false)
			}}
		>
			<Link
				href={getVideoUrl(value.id, undefined, undefined, true)}
				className='relative aspect-video'
			>
				<img
					src={value.thumbnailUrl}
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
					href={getChannelUrl(value.creator.nickName)}
					className='flex shrink-0'
				>
					<Avatar className='size-9'>
						<AvatarImage src={value.creator.profileImg} loading='lazy' />
						<AvatarFallback children={getUserInitials(value.creator.name)} />
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
						href={getChannelUrl(value.creator.nickName)}
						className='text-muted-foreground text-sm'
						children={value.creator.name}
					/>

					<div
						className='text-muted-foreground text-sm'
						children={`${formatNumbers(value.metrics?.viewsCount)} переглядів • ${formatTimeAgo(value.postedAt)}`}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoCard
