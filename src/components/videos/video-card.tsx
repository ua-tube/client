import { formatDuration, formatTimeAgo } from '@/utils'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

interface IVideoCardProps {
	id: string
	title: string
	channel: {
		id: string
		name: string
		profileUrl: string
	}
	views: number
	postedAt: Date
	duration: number
	thumbnailUrl: string
	videoUrl: string
}

const VideoCard: FC<IVideoCardProps> = ({
	id,
	title,
	videoUrl,
	postedAt,
	thumbnailUrl,
	duration,
	views,
	channel
}) => {
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
			className='flex flex-col gap-2 rounded-lg focus:bg-gray-100'
			onMouseEnter={() => {
				timeout && !isVideoPlaying && clearTimeout(timeout)
				setModalTimeout(setTimeout(() => setIsVideoPlaying(true), 1000))
			}}
			onMouseLeave={() => {
				timeout && clearTimeout(timeout)
				setIsVideoPlaying(false)
			}}
		>
			<Link href={`/watch/${id}`} className='relative aspect-video'>
				<img
					src={thumbnailUrl}
					className='block w-full h-full object-cover duration-200 rounded-xl'
					alt={id}
				/>
				<div
					className='absolute bothrefm-1 right-1 text-secondary text-sm px-1 rounded'
					children={formatDuration(duration)}
				/>
				<video
					className={`block h-full object-cover rounded-xl absolute inset-0 transition-opacity duration-200 ${isVideoPlaying ? 'opacity-100 delay-200' : 'opacity-0'}`}
					muted
					ref={videoRef}
					playsInline
					disablePictureInPicture
					src={videoUrl}
				/>
			</Link>

			<div className='flex gap-x-2'>
				<Link href={`/channel/${channel.id}`} className='flex shrink-0'>
					<img
						alt={channel.name}
						className='size-9 rounded-full'
						src={channel.profileUrl}
					/>
				</Link>
				<div className='flex flex-col'>
					<Link href={`/watch/${id}`} className='font-bold' children={title} />
					<Link
						href={`/channel/${channel.id}`}
						className='text-muted-foreground text-sm'
						children={channel.name}
					/>

					<div
						className='text-muted-foreground text-sm'
						children={`${Intl.NumberFormat(undefined, {
							notation: 'compact'
						}).format(views)} Views • ${formatTimeAgo(postedAt)}`}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoCard
