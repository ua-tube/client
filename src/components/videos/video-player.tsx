import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Slider
} from '@/components'
import { formatDuration } from '@/utils'
import {
	ChevronRight,
	Maximize2,
	PauseIcon,
	PlayIcon,
	Settings2,
	SettingsIcon,
	Shrink,
	Volume,
	Volume1,
	Volume2,
	VolumeX
} from 'lucide-react'
import { FC, useEffect, useRef, useState } from 'react'

const qualities = ['144p', '240p', '360p', '480p', '720p', '1080p']
const videoId = 'nRc6934CNs1'

const VideoPlayer: FC = () => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const [speed, setSpeed] = useState(1.0)
	const [quality, setQuality] = useState('144p')
	const [volume, setVolume] = useState(1.0)
	const [isHovered, setIsHovered] = useState(false)
	const [isFullScreen, setIsFullScreen] = useState(false)
	const [duration, setDuration] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)

	const togglePlay = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play()
			else videoRef.current.pause()
		}
	}

	const changeSpeed = (newSpeed: number) => {
		if (videoRef.current) {
			videoRef.current.playbackRate = newSpeed
			setSpeed(newSpeed)
		}
	}

	const changeQuality = (newQuality: string) => {
		if (videoRef.current) {
			const playing = !videoRef.current.paused
			videoRef.current.src = `${process.env.SERVER_URL}/videos/${videoId}/${newQuality}.mp4`
			handleTimeUpdate(currentTime)
			playing && videoRef.current.play()
			setQuality(newQuality)
		}
	}
	const changeVolume = (newVolume: number) => {
		if (videoRef.current) {
			videoRef.current.volume = newVolume
			setVolume(newVolume)
		}
	}

	const toggleMute = () => changeVolume(volume !== 0 ? 0 : 0.4)

	const toggleFullScreen = () => {
		if (videoRef.current) {
			try {
				if (!isFullScreen) videoRef.current?.requestFullscreen()
				else document?.exitFullscreen()
				setIsFullScreen(!isFullScreen)
			} catch {}
		}
	}

	const handleTimeUpdate = (time?: number) => {
		if (videoRef.current) {
			if (time) videoRef.current.currentTime = time
			setCurrentTime(videoRef.current.currentTime)
		}
	}

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.addEventListener('timeupdate', () => handleTimeUpdate())
			videoRef.current.addEventListener('loadedmetadata', () =>
				setDuration(videoRef.current?.duration || 0)
			)
		}
		return () => {
			if (videoRef.current)
				videoRef.current.removeEventListener('timeupdate', () =>
					handleTimeUpdate()
				)
		}
	}, [])

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			className='relative border border-input rounded-lg group/main'
		>
			<video ref={videoRef} className='w-full rounded-lg' onClick={togglePlay}>
				<source
					src={`${process.env.SERVER_URL}/videos/${videoId}/${quality}.mp4`}
					type='video/mp4'
				/>
			</video>

			<div className='hidden group-hover/main:absolute bottom-0 w-full bg-background/60 text-secondary-foreground p-3 group-hover/main:flex flex-col gap-y-3.5'>
				<Slider
					defaultValue={[0]}
					min={0}
					max={Math.floor(duration)}
					step={1}
					value={[Math.floor(currentTime)]}
					className='w-full group'
					trackClassName='flex items-center justify-center h-1'
					rangeClassName='h-1'
					thumbClassName='size-2 group-hover:size-3.5 transition-all duration-100'
					onValueChange={event => handleTimeUpdate(event[0])}
				/>
				<div className='flex justify-between items-center'>
					<div className='flex items-center space-x-1.5'>
						<button onClick={togglePlay}>
							{videoRef.current && videoRef.current.paused ? (
								<PlayIcon />
							) : (
								<PauseIcon />
							)}
						</button>
						<button>
							<ChevronRight />
						</button>
						<div className='group flex items-center gap-x-1.5'>
							<button
								onClick={toggleMute}
								children={
									volume === 0 ? (
										<VolumeX />
									) : volume < 0.2 ? (
										<Volume />
									) : volume < 0.5 ? (
										<Volume1 />
									) : volume < 1 || volume === 1 ? (
										<Volume2 />
									) : (
										<VolumeX />
									)
								}
							/>
							<Slider
								defaultValue={[0.5]}
								min={0}
								max={1}
								step={0.1}
								value={[volume]}
								thumbClassName='size-3.5'
								rangeClassName='h-0.5'
								trackClassName='flex items-center justify-center h-0.5'
								className='w-0 hidden transition-all duration-300 group-hover:opacity-100 opacity-0 group-hover:flex group-hover:w-14'
								onValueChange={event => changeVolume(event[0])}
							/>
							<span
								className='ml-1.5'
								children={`${formatDuration(currentTime)} / ${formatDuration(duration)}`}
							/>
						</div>
					</div>
					<div className='flex items-center space-x-2'>
						<select
							value={quality}
							onChange={e => changeQuality(e.target.value)}
							children={qualities.map((value, index) => (
								<option key={index} value={value} children={value} />
							))}
						/>

						<DropdownMenu>
							<DropdownMenuTrigger>
								<SettingsIcon />
							</DropdownMenuTrigger>
							<DropdownMenuContent className='z-50'>
								<DropdownMenuSub>
									<DropdownMenuSubTrigger>
										<div className='flex items-center space-x-2'>
											<Settings2 className='h-4 w-4' />
											<div className='' children={`Якість: ${quality}`} />
										</div>
									</DropdownMenuSubTrigger>
									<DropdownMenuPortal>
										<DropdownMenuSubContent
											children={qualities.map((value, index) => (
												<DropdownMenuItem
													key={index}
													onChange={e => changeQuality(value)}
													className='flex items-center justify-between'
												>
													<span children={value} />
													{value === quality && (
														<div className='bg-secondary-foreground rounded-full size-2' />
													)}
												</DropdownMenuItem>
											))}
										/>
									</DropdownMenuPortal>
								</DropdownMenuSub>
							</DropdownMenuContent>
						</DropdownMenu>

						<button
							onClick={toggleFullScreen}
							className='animate-pulse'
							children={isFullScreen ? <Shrink /> : <Maximize2 />}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default VideoPlayer
