import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	Slider,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components'
import { videoSpeeds } from '@/data'
import { formatDuration, getUrlForVideo, writeVideoUrl } from '@/utils'
import {
	ArrowRightCircle,
	ChevronRight,
	Gauge,
	LinkIcon,
	Maximize2,
	PauseIcon,
	PlayIcon,
	Repeat,
	Settings2,
	SettingsIcon,
	Shrink,
	Volume,
	Volume1,
	Volume2,
	VolumeX
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'

interface IVideoPlayerProps {
	qualities: string[]
	videoId: string
	nextVideoId: string
	autoPlay?: boolean
}


interface IVideoState {
	speed: number
	quality: string
	volume: number
	duration: number
	currentTime: number
	autoPlayNext: boolean
	isFullScreen: boolean
	isLooped: boolean
}

const VideoPlayer: FC<IVideoPlayerProps> = ({ videoId, qualities, nextVideoId, autoPlay }) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const { push, query } = useRouter()
	const [showMenu, setShowMenu] = useState<boolean>(true)
	const [videoState, setVideoState] = useState<IVideoState>({
		autoPlayNext: false,
		isLooped: false,
		duration: 0,
		quality: qualities?.[0] || '144p',
		speed: 1,
		volume: 0.5,
		isFullScreen: false,
		currentTime: 0
	})

	const togglePlay = () => {
		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play().catch()
			else videoRef.current.pause()
		}
	}

	const changeSpeed = (newSpeed: number) => {
		if (videoRef.current) {
			videoRef.current.playbackRate = newSpeed
			setVideoState(p => ({ ...p, speed: newSpeed }))
		}
	}

	const changeQuality = (newQuality: string) => {
		if (videoRef.current) {
			setVideoState(p => ({ ...p, quality: newQuality }))
			setTimeout(async () => {
				handleTimeUpdate(videoState.currentTime)
				await videoRef.current?.play()
			}, 100)
		}
	}
	const changeVolume = (volume: number) => {
		if (videoRef.current) {
			videoRef.current.volume = volume
			setVideoState(p => ({ ...p, volume }))
		}
	}

	const toggleMute = () => changeVolume(videoState.volume !== 0 ? 0 : 0.4)

	const toggleFullScreen = () => {
		if (videoRef.current) {
			try {
				if (!videoState.isFullScreen) videoRef.current?.requestFullscreen()
				else if (!window.screenTop && !window.screenY) document?.exitFullscreen()
				setVideoState(p => ({ ...p, isFullScreen: !p.isFullScreen }))
			} catch (e){}
		}
	}

	const handleTimeUpdate = (time?: number) => {
		if (videoRef.current) {
			if (time) videoRef.current.currentTime = time
			setVideoState(p => ({ ...p, currentTime: videoRef.current!.currentTime }))
		}
	}

	const onVideoEnd = async () =>
		!videoState.isLooped
		&& videoState.autoPlayNext
		&& await push(`/watch/${nextVideoId}`)


	const toggleRepeat = () => {
		if (videoRef.current) {
			videoRef.current.loop = !videoRef.current.loop
			setVideoState(p => ({ ...p, isLooped: videoRef.current!.loop }))
		}
	}

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.addEventListener('timeupdate', () => handleTimeUpdate())
			videoRef.current.addEventListener('loadedmetadata', () =>
				setVideoState(p => ({ ...p, duration: videoRef.current?.duration || 0 }))
			)
		}
		return () => {
			if (videoRef.current)
				videoRef.current.removeEventListener('timeupdate', () =>
					handleTimeUpdate()
				)
		}
	}, [])

	useEffect(() => {
		changeVolume(+(sessionStorage?.getItem('volume') || 0.5))
		setVideoState(p => ({ ...p, autoPlayNext: Boolean(+(sessionStorage.getItem('autoPlayNext') || 0)) }))
		if (query?.time) handleTimeUpdate(+query.time)
		if (videoRef.current) {
			videoRef.current.autoplay = autoPlay || false
		}
	}, [])

	useEffect(() => {
		sessionStorage.setItem('volume', `${videoState.volume}`)
		sessionStorage.setItem('autoPlayNext', `${Number(videoState.autoPlayNext)}`)
	}, [videoState.volume, videoState.autoPlayNext])

	return (
		<TooltipProvider delayDuration={0}>
			<div
				onMouseEnter={() => setShowMenu(true)}
				onMouseLeave={() => !videoRef.current?.paused && setShowMenu(false)}
				className="relative border border-input rounded-lg group/main"
			>
				<ContextMenu>
					<ContextMenuTrigger className="size-full">
						<video
							ref={videoRef}
							className="w-full rounded-lg aspect-video"
							onClick={togglePlay}
							src={getUrlForVideo(videoId, videoState.quality)}
							onEnded={onVideoEnd}
							controls={false}
						/>
					</ContextMenuTrigger>
					<ContextMenuContent>

						<ContextMenuItem
							className="flex items-center justify-between"
							onClick={() => setVideoState(p => ({ ...p, autoPlayNext: !p.autoPlayNext }))}
						>
							<div className="items-center flex space-x-2">
								<ArrowRightCircle />
								<span children="Автопрогравання" />
							</div>
							{videoState.autoPlayNext && <div className="checkedIcon" />}
						</ContextMenuItem>

						<ContextMenuItem
							className="flex items-center justify-between"
							onClick={toggleRepeat}
						>
							<div className="items-center flex space-x-2">
								<Repeat />
								<span children="Повторювати" />
							</div>
							{videoState.isLooped && <div className="checkedIcon" />}
						</ContextMenuItem>

						<ContextMenuItem
							className="flex items-center justify-between"
							onClick={() => writeVideoUrl(videoId)}
						>
							<div className="items-center flex space-x-2">
								<LinkIcon />
								<span children="Копіювати URL-адресу відео" />
							</div>
						</ContextMenuItem>
						<ContextMenuItem
							className="flex items-center justify-between"
							onClick={() => writeVideoUrl(videoId, Math.floor(videoState.currentTime))}
						>
							<div className="items-center flex space-x-2">
								<LinkIcon />
								<span children="Копіювати URL-адресу з цього часу" />
							</div>
						</ContextMenuItem>
					</ContextMenuContent>
				</ContextMenu>


				<div
					className={`absolute transition-all duration-200 bottom-0 w-full bg-background/60 text-secondary-foreground p-3 flex flex-col gap-y-3.5 ${
						showMenu ?
							'opacity-100' :
							'opacity-0'}`}>
					<Slider
						defaultValue={[0]}
						min={0}
						max={Math.floor(videoState.duration)}
						step={1}
						value={[Math.floor(videoState.currentTime)]}
						className="w-full group"
						trackClassName="flex items-center justify-center h-1"
						rangeClassName="h-1"
						thumbClassName="size-2 group-hover:size-3.5 transition-all duration-100"
						onValueChange={event => handleTimeUpdate(event[0])}
					/>
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-1.5">
							<Tooltip>
								<TooltipTrigger
									onClick={togglePlay}
									children={
										videoRef.current && videoRef.current.paused ? (
											<PlayIcon />
										) : (
											<PauseIcon />
										)} />
								<TooltipContent children={videoRef.current && videoRef.current.paused ? 'Грати' : 'Пауза'} />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Link href={`/watch/${nextVideoId}`}><ChevronRight /></Link>
								</TooltipTrigger>
								<TooltipContent children="Наступне відео" />
							</Tooltip>

							<div className="group/volume flex items-center gap-x-1.5">
								<Tooltip>
									<TooltipTrigger
										onClick={toggleMute}
										children={
											videoState.volume === 0 ? (
												<VolumeX />
											) : videoState.volume < 0.4 ? (
												<Volume />
											) : videoState.volume < 0.7 ? (
												<Volume1 />
											) : (videoState.volume < 1 || videoState.volume === 1) ? (
												<Volume2 />
											) : (
												<VolumeX />
											)
										} />
									<TooltipContent children={videoState.volume === 0 ? 'Увімкнути звук' : 'Вимкнути звук'} />
								</Tooltip>
								<div
									className="transition-all duration-200 ease-linear opacity-0 w-0 group-hover/volume:opacity-100 group-hover/volume:w-14">
									<Slider
										defaultValue={[0.5]}
										min={0}
										max={1}
										step={0.05}
										value={[videoState.volume]}
										thumbClassName="size-3.5"
										rangeClassName="h-0.5"
										trackClassName="flex items-center justify-center h-0.5"
										className="w-14 group-hover/volume:flex"
										onValueChange={event => changeVolume(event[0])}
									/>
								</div>
								<span
									className="ml-1 group-hover/volume:ml-1.5"
									children={`${formatDuration(videoState.currentTime)} / ${formatDuration(videoState.duration)}`}
								/>
							</div>
						</div>
						<div className="flex items-center space-x-3">

							<Tooltip>
								<TooltipTrigger
									className="flex items-center"
									children={<Switch
										checked={videoState.autoPlayNext}
										onCheckedChange={autoPlayNext => setVideoState(p => ({ ...p, autoPlayNext }))}
									/>}
								/>
								<TooltipContent
									children={`Автопрогравання наступного відео (${videoState.autoPlayNext ? 'увімкнено' : 'вимкнено'})`} />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger>
									<DropdownMenu>
										<DropdownMenuTrigger
											onClick={() => setShowMenu(true)}
											className="flex items-center"
										>
											<SettingsIcon className="hover:animate-spin" />
										</DropdownMenuTrigger>
										<DropdownMenuContent >
											<DropdownMenuCheckboxItem
												checked={videoState.isLooped}
												onCheckedChange={toggleRepeat}
												children="Повторювати"
											/>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger className="justify-between">
													<div className="flex items-center space-x-2">
														<Gauge className="h-4 w-4" />
														<div children={`Швидкість відтворення: ${videoState.speed}x`} />
													</div>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent
														children={videoSpeeds.map((value, index) => (
															<DropdownMenuItem
																key={index}
																onClick={() => changeSpeed(value)}
																className="flex items-center justify-between"
															>
																<span children={value} />
																{value === videoState.speed && (<div className="checkedIcon" />)}
															</DropdownMenuItem>
														))}
													/>
												</DropdownMenuPortal>
											</DropdownMenuSub>
											<DropdownMenuSub>
												<DropdownMenuSubTrigger>
													<div className="flex items-center space-x-2">
														<Settings2 className="h-4 w-4" />
														<div children={`Якість: ${videoState.quality}`} />
													</div>
												</DropdownMenuSubTrigger>
												<DropdownMenuPortal>
													<DropdownMenuSubContent
														children={qualities.map((value, index) => (
															<DropdownMenuItem
																key={index}
																onClick={() => changeQuality(value)}
																className="flex items-center justify-between"
															>
																<span children={value} />
																{value === videoState.quality && (<div className="checkedIcon" />)}
															</DropdownMenuItem>
														))}
													/>
												</DropdownMenuPortal>
											</DropdownMenuSub>
										</DropdownMenuContent>
									</DropdownMenu>
								</TooltipTrigger>
								<TooltipContent children="Налаштування" />
							</Tooltip>
							<Tooltip>
								<TooltipTrigger
									onClick={toggleFullScreen}
									className="hover:animate-pulse"
									children={videoState.isFullScreen ? <Shrink /> : <Maximize2 />}
								/>
								<TooltipContent children="Повноекраний режим" />
							</Tooltip>

						</div>
					</div>
				</div>
			</div>
		</TooltipProvider>
	)
}

export default VideoPlayer
