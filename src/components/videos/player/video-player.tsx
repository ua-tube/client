import {
	Button,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	HoverCard,
	HoverCardArrow,
	HoverCardContent,
	HoverCardTrigger,
	Slider,
	Switch,
	Tooltip,
	TooltipArrow,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger
} from '@/components'
import { useSidebarContext } from '@/components/layouts/home/home-layout'
import { videoSpeeds } from '@/data'
import { formatDuration, getAllElementsFromOrToCurrentElement, getUrlForVideo, writeVideoUrl } from '@/utils'
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
import { FC, useCallback, useEffect, useRef, useState } from 'react'


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
	bufferedCount: number
	currentTime: number
	autoPlayNext: boolean
	isFullScreen: boolean
	isLooped: boolean
	disabledQualities: string[]
}

const VideoPlayer: FC<IVideoPlayerProps> = ({ videoId, qualities, nextVideoId, autoPlay }) => {
	const videoRef = useRef<HTMLVideoElement>(null)
	const divRef = useRef<HTMLDivElement>(null)
	const { push, query } = useRouter()
	const { isLargeOpen } = useSidebarContext()
	const [showMenu, setShowMenu] = useState<boolean>(true)
	const [videoState, setVideoState] = useState<IVideoState>({
		autoPlayNext: false,
		isLooped: false,
		duration: 0,
		quality: qualities[0],
		speed: 1,
		volume: 0.5,
		isFullScreen: false,
		currentTime: 0,
		bufferedCount: 0,
		disabledQualities: []
	})

	const togglePlay = useCallback(() => {
		if (videoRef.current) {
			if (videoRef.current.paused) videoRef.current.play().catch()
			else videoRef.current.pause()
		}
	}, [])

	const changeSpeed = useCallback((newSpeed: number) => {
		if (videoRef.current) {
			videoRef.current.playbackRate = newSpeed
			setVideoState(p => ({ ...p, speed: newSpeed }))
		}
	}, [])

	const onTimeUpdateHandler = useCallback((time?: number) => {
		if (videoRef.current) {
			if (time) videoRef.current.currentTime = time
			setVideoState(p => ({ ...p, currentTime: videoRef.current!.currentTime }))
		}
	}, [])

	const changeQuality = useCallback((newQuality: string) => {
		if (videoRef.current) {
			setVideoState(p => ({ ...p, quality: newQuality }))
			setTimeout(async () => {
				onTimeUpdateHandler(videoState.currentTime)
				await videoRef.current?.play()
			}, 100)
		}
	}, [onTimeUpdateHandler, videoState.currentTime])

	const changeVolume = useCallback((volume: number) => {
		if (videoRef.current && (volume < 1 && volume > 0)) {
			videoRef.current.volume = volume
			setVideoState(p => ({ ...p, volume }))
		}
	}, [])

	const toggleMute = useCallback(() => changeVolume(videoState.volume !== 0 ? 0 : 0.4), [videoState.volume, changeVolume])

	const toggleFullScreen = useCallback(() => {
		if (divRef.current) {
			if (!videoState.isFullScreen) {
				divRef.current?.requestFullscreen()?.catch(reason => console.log(reason))
				setVideoState(p => ({ ...p, isFullScreen: true }))
			} else {
				document?.exitFullscreen()?.catch(reason => console.log(reason))
				setVideoState(p => ({ ...p, isFullScreen: false }))
			}
		}
	}, [videoState.isFullScreen])


	const onVideoEnd = useCallback(async () => videoState.autoPlayNext && await push(`/watch?videoId=${nextVideoId}`), [videoState.autoPlayNext, push, nextVideoId])

	const onVideoLoadError = useCallback(() => {
		setVideoState(p => ({
			...p,
			disabledQualities: getAllElementsFromOrToCurrentElement(qualities, videoState.quality, true)
		}))
		changeQuality(getAllElementsFromOrToCurrentElement(qualities, videoState.quality).at(-1) || qualities[0])
	}, [qualities, videoState.quality, changeQuality])

	const toggleRepeat = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.loop = !videoRef.current.loop
			setVideoState(p => ({
				...p,
				isLooped: videoRef.current!.loop,
				autoPlayNext: false
			}))
		}
	}, [])

	const toggleAutoPlayNext = useCallback(() => {
		videoState.isLooped && toggleRepeat()
		setVideoState(p => ({ ...p, autoPlayNext: !p.autoPlayNext }))
	}, [videoState.isLooped, toggleRepeat])


	const onProgressHandler = useCallback(() => {
		if (videoRef.current) {
			const buffered = videoRef.current.buffered
			const bufferedTotal = () => {
				let total = videoState.currentTime
				for (let i = 0; i < buffered.length; i++)
					if (buffered.end(i) > videoState.currentTime)
						if (buffered.start(i) < videoState.currentTime)
							total += buffered.end(i) - videoState.currentTime
						else
							total += buffered.end(i) - buffered.start(i)
				return total
			}
			setVideoState(p => ({ ...p, bufferedCount: bufferedTotal() }))
		}
	}, [videoState.currentTime])

	const buttonsCallBack = useCallback((event: KeyboardEvent) => {
		event.preventDefault()
		switch (event.key) {
			case 'а':
			case 'f':
				toggleFullScreen()
				break
			case ' ':
				togglePlay()
				break
			case 'ь':
			case 'm':
				toggleMute()
				break
			case 'ArrowUp':
				changeVolume(videoState.volume + 0.05)
				break
			case 'ArrowDown':
				changeVolume(videoState.volume - 0.05)
				break
			case 'ArrowLeft':
				onTimeUpdateHandler(videoState.currentTime - 5)
				break
			case 'ArrowRight':
				onTimeUpdateHandler(videoState.currentTime + 5)
				break
		}
	}, [videoState.volume, videoState.currentTime, toggleFullScreen, togglePlay, toggleMute, changeVolume, onTimeUpdateHandler])


	const fullScreenChangeListener = useCallback((event: Event) => {
		event.preventDefault()
		videoState.isFullScreen &&
		setVideoState(p => ({
			...p,
			isFullScreen: (document.fullscreenEnabled ? document.fullscreenElement : null) !== null
		}))
	}, [videoState.isFullScreen])


	useEffect(() => {
		document.addEventListener('keydown', buttonsCallBack)
		document.addEventListener('fullscreenchange', fullScreenChangeListener)
		if (videoRef.current) {
			videoRef.current.addEventListener('progress', onProgressHandler)
			videoRef.current.addEventListener('timeupdate', () => onTimeUpdateHandler())
			videoRef.current.addEventListener('loadedmetadata', () =>
				setVideoState(p => ({ ...p, duration: videoRef.current?.duration || 0 }))
			)
		}
		return () => {
			document.removeEventListener('keydown', buttonsCallBack)
			document.removeEventListener('fullscreenchange', fullScreenChangeListener)
			if (videoRef.current) {
				videoRef.current.removeEventListener('progress', onProgressHandler)
				videoRef.current.removeEventListener('timeupdate', () =>
					onTimeUpdateHandler()
				)
			}
		}
	}, [videoState])


	useEffect(() => {
		setVideoState(p => ({
			...p,
			disabledQualities: [],
			bufferedCount: 0,
			autoPlayNext: Boolean(+(sessionStorage.getItem('autoPlayNext') || 0))
		}))
		changeVolume(+(sessionStorage?.getItem('volume') || 0.5))
		query?.time && onTimeUpdateHandler(+query.time)
		autoPlay && togglePlay()
	}, [videoId])

	useEffect(() => {
		sessionStorage.setItem('volume', `${videoState.volume}`)
		sessionStorage.setItem('autoPlayNext', `${Number(videoState.autoPlayNext)}`)
	}, [videoState.volume, videoState.autoPlayNext])

	return (<div
			ref={divRef}
			onMouseEnter={() => setShowMenu(true)}
			onMouseLeave={() => !videoRef.current?.paused && setShowMenu(false)}
			onDoubleClick={toggleFullScreen}
			className="group/main relative rounded-lg"
		>
			<ContextMenu>
				<ContextMenuTrigger className="size-full flex items-center">
					<video
						ref={videoRef}
						className="w-full rounded-lg aspect-video bg-black/80"
						onClick={togglePlay}
						onError={onVideoLoadError}
						src={getUrlForVideo(videoId, videoState.quality)}
						onEnded={onVideoEnd}
						controls={false}
					/>
				</ContextMenuTrigger>

				<ContextMenuContent>

					<ContextMenuItem
						className="flex items-center justify-between"
						onClick={toggleAutoPlayNext}
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
					value={[Math.floor(videoState.currentTime), 0, Math.floor(videoState.bufferedCount), 0]}
					className="w-full group"
					trackClassName="flex items-center justify-center h-1 hover:cursor-pointer"
					rangeClassName="h-1"
					thumbClassName="size-2 group-hover:size-3.5 transition-all duration-100"
					onValueChange={event => onTimeUpdateHandler(event[3])}
				/>
				<TooltipProvider delayDuration={0}>
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
									<Link href={`/watch?videoId=${nextVideoId}`}><ChevronRight /></Link>
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
									className="transition-all duration-200 ease-linear opacity-100 md:opacity-0 w-14 md:w-0 group-hover/volume:opacity-100 group-hover/volume:w-14">
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
										onCheckedChange={toggleAutoPlayNext}
									/>}
								/>
								<TooltipContent
									children={`Автопрогравання (${
										videoState.autoPlayNext ?
											'увімкнено' :
											'вимкнено'
									})`} />
							</Tooltip>

							<HoverCard>
								<HoverCardTrigger>
									<SettingsIcon />
								</HoverCardTrigger>

								<HoverCardContent side={isLargeOpen ? 'bottom' : 'top'} align="end" className="flex flex-col gap-y-2">

									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center space-x-2">
												<Gauge className="h-4 w-4" />
												<div children={`Швидкість відтворення: ${videoState.speed}x`} />
											</div>
										</TooltipTrigger>
										<TooltipContent side="left" align="end">
											<div
												className="flex flex-col gap-y-2"
												children={videoSpeeds.map((value, index) =>
													<Button
														key={index}
														size="sm"
														variant={value === videoState.speed ? 'secondary' : 'outline'}
														className="w-40"
														children={`${value}x`}
														onClick={() => changeSpeed(value)}
													/>
												)} />
											<TooltipArrow className="w-3 h-2" />
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center space-x-2">
												<Settings2 className="h-4 w-4" />
												<div children={`Якість: ${videoState.quality}`} />
											</div>
										</TooltipTrigger>
										<TooltipContent side="left" align="end">
											<div
												className="flex flex-col gap-y-2"
												children={qualities.map((value, index) =>
													<Button
														key={index}
														size="sm"
														variant={value === videoState.quality ? 'secondary' : 'outline'}
														className="w-40"
														children={value}
														onClick={() => changeQuality(value)}
														disabled={videoState.disabledQualities?.includes(value)}
													/>
												)} />
											<TooltipArrow className="w-3 h-2" />
										</TooltipContent>
									</Tooltip>
									<HoverCardArrow className="w-3 h-2" />
								</HoverCardContent>
							</HoverCard>
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
				</TooltipProvider>
			</div>
		</div>
	)
}

export default VideoPlayer
