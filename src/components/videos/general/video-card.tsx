import { IVideo } from '@/interfaces/video.inteface'
import { formatDuration, formatTimeAgo } from '@/utils'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'

interface IVideoCardProps extends IVideo {
}

const VideoCard: FC<IVideoCardProps> = (value) => {
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
			className="flex flex-col gap-2 rounded-lg focus:bg-gray-100"
			onMouseEnter={() => {
				timeout && !isVideoPlaying && clearTimeout(timeout)
				setModalTimeout(setTimeout(() => setIsVideoPlaying(true), 1000))
			}}
			onMouseLeave={() => {
				timeout && clearTimeout(timeout)
				setIsVideoPlaying(false)
			}}
		>
			<Link href={`/watch/${value.id}`} className="relative aspect-video">
				<img
					src={value.thumbnailUrl}
					className="block w-full h-full object-cover duration-200 rounded-xl"
					alt={value.id}
				/>
				<div
					className="absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded"
					children={formatDuration(value.duration)}
				/>
				<video
					className={`block h-full object-cover rounded-xl absolute inset-0 transition-opacity duration-200 ${isVideoPlaying ? 'opacity-100 delay-200' : 'opacity-0'}`}
					muted
					ref={videoRef}
					playsInline
					disablePictureInPicture
					src={value.videoUrl}
				/>
			</Link>

			<div className="flex gap-x-2">
				<Link href={`/channel/${value.channel.id}`} className="flex shrink-0">
					<img
						alt={value.channel.name}
						className="size-9 rounded-full"
						src={value.channel.profileImageUrl}
					/>
				</Link>
				<div className="flex flex-col">
					<Link href={`/watch/${value.id}`} className="font-bold" children={value.title} />
					<Link
						href={`/channel/${value.channel.id}`}
						className="text-muted-foreground text-sm"
						children={value.channel.name}
					/>

					<div
						className="text-muted-foreground text-sm"
						children={`${Intl.NumberFormat(undefined, {
							notation: 'compact'
						}).format(value.views)} переглядів • ${formatTimeAgo(value.postedAt)}`}
					/>
				</div>
			</div>
		</div>
	)
}

export default VideoCard
