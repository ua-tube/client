import { IVideo } from '@/interfaces/video.inteface'
import { formatDuration, formatTimeAgo } from '@/utils'
import Link from 'next/link'
import { FC, useEffect, useRef, useState } from 'react'


interface ISidebarVideoCardProps extends IVideo {}

const SidebarVideoCard: FC<ISidebarVideoCardProps> = (value) => {
	const [isVideoPlaying, setIsVideoPlaying] = useState(false)
	const [timeout, setModalTimeout] = useState<any>(null)
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (videoRef.current === null) return
		if (isVideoPlaying) {
			videoRef.current.currentTime = 0
			videoRef.current.play().catch()
		} else videoRef.current.pause()
	}, [isVideoPlaying])


	return <div className="flex flex-row items-start gap-2"
							onMouseEnter={() => {
								timeout && !isVideoPlaying && clearTimeout(timeout)
								setModalTimeout(setTimeout(() => setIsVideoPlaying(true), 1000))
							}}
							onMouseLeave={() => {
								timeout && clearTimeout(timeout)
								setIsVideoPlaying(false)
							}}>
		<Link href={`/watch/${value.id}`} className="relative aspect-video w-2/5">
			<img
				src={value.thumbnailUrl}
				className="block w-full h-full object-cover duration-200 rounded-lg"
				alt={value.id}
			/>
			<div
				className="absolute bottom-0.5 right-0.5 bg-background/80 text-secondary-foreground text-xs px-1 rounded"
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
		<div className="flex gap-x-2 w-3/5">
			<div className="flex flex-col">
				<Link href={`/watch/${value.id}`} className="font-bold text-base/6 line-clamp-2" children={value.title} />
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
