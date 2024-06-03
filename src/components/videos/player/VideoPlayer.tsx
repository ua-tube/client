import { cn, formatDuration, getVideoUrl, writeVideoUrl } from '@/utils'
import { FC, useCallback, useEffect, useRef, useState } from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { UseState, IVideo } from '@/interfaces'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Hls from 'hls.js'
import {
	Button,
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
	DynamicIcon,
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
import { useSidebarContext } from '@/providers'

interface IVideoPlayerProps {
	video: Pick<
		IVideo,
		'nextId' | 'prevId' | 'masterPlaylistUrl' | 'id' | 'status'
	>
	autoPlay?: boolean
	cinemaMode: boolean
	setCinemaMode: UseState<boolean>
}

interface IHlsLevel {
	height: number
	width: number
}

interface IVideoState {
	selectedLevel: number
	levels?: Array<IHlsLevel>
	speed: number
	volume: number
	duration: number
	bufferedCount: number
	isLoading: boolean
	currentTime: number
	autoPlayNext: boolean
	isFullScreen: boolean
	showNavigationMenu: boolean
	showLoadingAnimation: boolean
	isLooped: boolean
	isDisabled: boolean
}

const VideoPlayer: FC<IVideoPlayerProps> = ({
																							video,
																							autoPlay,
																							setCinemaMode,
																							cinemaMode
																						}) => {
	const { push, query } = useRouter()
	const { isOpen } = useSidebarContext()

	const [hls, setHls] = useState<Hls | null>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const divRef = useRef<HTMLDivElement>(null)

	const [videoState, setVideoState] = useState<IVideoState>({
		autoPlayNext: false,
		selectedLevel: -1,
		levels: [],
		isLooped: false,
		duration: 0,
		isLoading: true,
		speed: 1,
		volume: 0.5,
		isFullScreen: false,
		currentTime: 0,
		bufferedCount: 0,
		showLoadingAnimation: false,
		showNavigationMenu: true,
		isDisabled: false
	})

	const onProgressHandler = useCallback(() => {
		if (videoRef.current) {
			const { buffered, currentTime } = videoRef.current
			let bufferedCount = 0

			for (let i = 0; i < buffered.length; i++) {
				if (buffered.end(i) > currentTime) {
					if (buffered.start(i) < currentTime)
						bufferedCount += buffered.end(i) - currentTime
					else bufferedCount += buffered.end(i) - buffered.start(i)
				}
			}

			setVideoState(prevState => ({
				...prevState,
				bufferedCount
				// isLoading: currentTime > bufferedCount
			}))
		}
	}, [setVideoState])

	const onTimeUpdateHandler = useCallback(
		(time?: number) => {
			if (videoRef.current) {
				if (time) videoRef.current.currentTime = time
				setVideoState(p => ({
					...p,
					currentTime: time || videoRef.current!.currentTime
				}))
			}
		},
		[setVideoState]
	)

	const changeQuality = (selectedLevel: number) => {
		if (hls) hls.nextLevel = selectedLevel
		setVideoState(p => ({ ...p, selectedLevel }))
	}

	const showPlayAnimation = useCallback(() => {
		setVideoState(s => ({ ...s, showLoadingAnimation: true }))
		setTimeout(
			() => setVideoState(s => ({ ...s, showLoadingAnimation: false })),
			1000
		)
	}, [setVideoState])

	const togglePlay = useCallback(
		(disableAnimation?: boolean) => {
			if (videoRef.current) {
				if (videoRef.current.paused) videoRef.current.play().catch()
				else videoRef.current.pause()
				if (!disableAnimation) showPlayAnimation()
			}
		},
		[showPlayAnimation]
	)

	const changeSpeed = useCallback(
		(speed: number) => {
			if (videoRef.current) {
				videoRef.current.playbackRate = speed
				setVideoState(p => ({ ...p, speed }))
			}
		},
		[setVideoState]
	)

	const changeVolume = useCallback(
		(volume: number) => {
			if (videoRef.current && volume < 1.01 && volume > -0.01) {
				videoRef.current.volume = volume
				setVideoState(p => ({ ...p, volume }))
				sessionStorage.setItem(
					'video-state',
					JSON.stringify({ ...videoState, volume })
				)
			}
		},
		[setVideoState, videoState]
	)

	const toggleMute = useCallback(
		() => changeVolume(videoState.volume !== 0 ? 0 : 0.4),
		[videoState.volume, changeVolume]
	)

	const toggleFullScreen = useCallback(() => {
		if (divRef.current) {
			if (!videoState.isFullScreen) {
				divRef.current
					?.requestFullscreen()
					?.catch(reason => console.log(reason))
				setVideoState(p => ({ ...p, isFullScreen: true }))
			} else {
				document?.exitFullscreen()?.catch(reason => console.log(reason))
				setVideoState(p => ({ ...p, isFullScreen: false }))
			}
		}
	}, [videoState.isFullScreen, setVideoState])

	const onVideoEnd = useCallback(async () => {
		if (videoState.autoPlayNext && videoState.isLooped && videoRef.current) {
			videoRef.current.loop = false
			setVideoState(p => ({ ...p, isLooped: false }))
		}
		if (videoState.autoPlayNext && video?.nextId)
			await push(
				getVideoUrl(
					video?.nextId,
					undefined,
					query?.listId ? (query.listId as string) : undefined,
					true
				)
			)
	}, [
		videoState.autoPlayNext,
		push,
		query.listId,
		videoState.isLooped,
		setVideoState,
		video?.nextId
	])

	const toggleRepeat = useCallback(() => {
		if (videoRef.current) {
			videoRef.current.loop = !videoRef.current.loop
			setVideoState(p => ({
				...p,
				isLooped: videoRef.current!.loop,
				autoPlayNext: false
			}))
		}
	}, [setVideoState])

	const toggleAutoPlayNext = useCallback(() => {
		videoState.isLooped && toggleRepeat()
		sessionStorage.setItem(
			'video-state',
			JSON.stringify({ ...videoState, autoPlayNext: !videoState.autoPlayNext })
		)
		setVideoState(p => ({ ...p, autoPlayNext: !p.autoPlayNext }))
	}, [toggleRepeat, setVideoState, videoState])

	const buttonsCallBack = useCallback(
		(event: KeyboardEvent) => {
			if (videoState.isFullScreen) {
				const key = event.key.toLowerCase()
				switch (key) {
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
					case 'arrowup':
						changeVolume(videoState.volume + 0.05)
						break
					case 'arrowdown':
						changeVolume(videoState.volume - 0.05)
						break
					case 'arrowleft':
						onTimeUpdateHandler(videoState.currentTime - 5)
						break
					case 'arrowright':
						onTimeUpdateHandler(videoState.currentTime + 5)
						break
				}
			}
		},
		[
			videoState.volume,
			videoState.currentTime,
			toggleFullScreen,
			togglePlay,
			toggleMute,
			changeVolume,
			onTimeUpdateHandler,
			videoState.isFullScreen
		]
	)

	const fullScreenChangeListener = useCallback(
		(event: Event) => {
			event.preventDefault()
			videoState.isFullScreen &&
			setVideoState(p => ({
				...p,
				isFullScreen:
					(document.fullscreenEnabled ? document.fullscreenElement : null) !==
					null
			}))
		},
		[videoState.isFullScreen, setVideoState]
	)

	const onLoadingListener = useCallback(
		(isLoading: boolean) => setVideoState(p => ({ ...p, isLoading })),
		[setVideoState]
	)

	useEffect(() => {
		document.addEventListener('keydown', buttonsCallBack)
		document.addEventListener('fullscreenchange', fullScreenChangeListener)

		if (videoRef.current) {
			videoRef.current.addEventListener('canplay', () =>
				onLoadingListener(false)
			)
		}
		return () => {
			document.removeEventListener('keydown', buttonsCallBack)
			document.removeEventListener('fullscreenchange', fullScreenChangeListener)

			if (videoRef.current) {
				videoRef.current.removeEventListener('canplay', () =>
					onLoadingListener(false)
				)
			}
		}
	}, [videoState])

	useEffect(() => {
		let timeout: any

		const displayOpa = () => {
			setVideoState(p => ({ ...p, showNavigationMenu: true }))

			clearTimeout(timeout)

			timeout = setTimeout(() => {
				setVideoState(p => ({ ...p, showNavigationMenu: false }))
			}, 5000)
		}
		divRef.current?.addEventListener('mousemove', displayOpa)

		return () => {
			divRef.current?.removeEventListener('mousemove', displayOpa)
		}
	}, [])

	useEffect(() => {
		const hlsInstance = new Hls({
			startLevel: -1,
			autoStartLoad: true,
			maxBufferLength: 60,
			maxBufferSize: 60 * 1000 * 1000,
			abrEwmaDefaultEstimate: 5 * 1000 * 1000
		})
		if (Hls.isSupported() && videoRef?.current) {
			hlsInstance.loadSource(video?.masterPlaylistUrl!)
			hlsInstance.attachMedia(videoRef.current!)

			hlsInstance.on(Hls.Events.MANIFEST_PARSED, () =>
				setVideoState(p => ({
					...p,
					levels: hlsInstance.levels,
					selectedLevel: hlsInstance.currentLevel
				}))
			)

			hlsInstance.on(Hls.Events.ERROR, (_, data) => {
				if (data.fatal) {
					setVideoState(p => ({ ...p, isDisabled: true }))
					switch (data.type) {
						case Hls.ErrorTypes.NETWORK_ERROR:
							console.error('Fatal network error:', data)
							hlsInstance.startLoad()

							break
						case Hls.ErrorTypes.MEDIA_ERROR:
							console.error('Fatal error of the media:', data)
							hlsInstance.recoverMediaError()
							break
						default:
							console.error('Unknown fatal error:', data)
							hlsInstance.destroy()
							break
					}
				}
			})

			hlsInstance.on(Hls.Events.LEVEL_SWITCHED, (_, { level }) => {
				setVideoState(p => ({ ...p, selectedLevel: level }))
			})

			setHls(hlsInstance)
		} else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
			videoRef.current.src = video?.masterPlaylistUrl!
		}

		return () => {
			if (hlsInstance) hlsInstance.destroy()
		}
	}, [video])

	useEffect(() => {
		setVideoState(p => ({ ...p, bufferedCount: 0, selectedQuality: -1, isDisabled: false }))

		const previousVideoStateStr = sessionStorage.getItem('video-state')
		const previousVideoState = previousVideoStateStr
			? (JSON.parse(previousVideoStateStr) as IVideoState)
			: null

		!videoState.autoPlayNext &&
		previousVideoState?.autoPlayNext &&
		toggleAutoPlayNext()
		typeof previousVideoState?.volume !== 'undefined' &&
		changeVolume(previousVideoState.volume || 0.5)
		previousVideoState?.speed && changeSpeed(previousVideoState?.speed || 1)
	}, [video])

	return (
		<div
			ref={divRef}
			onDoubleClick={toggleFullScreen}
			className={cn(
				'group/main relative',
				!cinemaMode ? 'rounded-lg' : 'h-[80vh] mb-4 bg-black/80',
				cinemaMode && !videoState.isFullScreen && ' border-b-2'
			)}
		>
			<ContextMenu>
				<ContextMenuTrigger className="size-full flex items-center justify-center overflow-y-hidden">
					<video
						ref={videoRef}
						controls={false}
						className={cn(
							'bg-black/80 ',
							!cinemaMode
								? ' w-full aspect-video rounded-lg'
								: 'h-full object-center'
						)}
						onClick={() => togglePlay()}
						onLoadStart={() => onLoadingListener(true)}
						onLoadedData={() => onLoadingListener(false)}
						onProgress={onProgressHandler}
						onTimeUpdate={() => onTimeUpdateHandler()}
						onLoadedMetadata={() => {
							setVideoState(p => ({
								...p,
								duration: videoRef.current?.duration || 0
							}))
							autoPlay && togglePlay(true)
						}}
						onEnded={onVideoEnd}
					/>
				</ContextMenuTrigger>

				<ContextMenuContent>
					{video?.nextId && (
						<ContextMenuItem
							className="flex items-center justify-between"
							onClick={toggleAutoPlayNext}
						>
							<div className="items-center flex space-x-2">
								<DynamicIcon name="arrow-right-circle" />
								<span children="Автопрогравання" />
							</div>
							{videoState.autoPlayNext && <div className="checkedIcon" />}
						</ContextMenuItem>
					)}

					<ContextMenuItem
						className="flex items-center justify-between"
						onClick={toggleRepeat}
					>
						<div className="items-center flex space-x-2">
							<DynamicIcon name="repeat" />
							<span children="Повторювати" />
						</div>
						{videoState.isLooped && <div className="checkedIcon" />}
					</ContextMenuItem>

					<ContextMenuItem
						className="flex items-center justify-between"
						onClick={() => writeVideoUrl(video.id)}
					>
						<div className="items-center flex space-x-2">
							<DynamicIcon name="link" />
							<span children="Копіювати URL-адресу відео" />
						</div>
					</ContextMenuItem>
					<ContextMenuItem
						className="flex items-center justify-between"
						onClick={() =>
							writeVideoUrl(video.id, Math.floor(videoState.currentTime))
						}
					>
						<div className="items-center flex space-x-2">
							<DynamicIcon name="link" />
							<span children="Копіювати URL-адресу з цього часу" />
						</div>
					</ContextMenuItem>
				</ContextMenuContent>
			</ContextMenu>

			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-3">
				{videoState.showLoadingAnimation && !videoState.isLoading && (
					<DynamicIcon
						name={
							videoRef.current && videoRef.current.paused
								? 'pause-circle'
								: 'play-circle'
						}
						className="animate-ping delay-100 duration-1000 transition-all size-14 bg-black/60 rounded-full"
					/>
				)}
				{videoState.isLoading && !videoState.isDisabled && (
					<DynamicIcon
						name="loader-2"
						className="animate-spin transition-all size-14 bg-black/60 rounded-full"
					/>
				)}
				{videoState.isDisabled && video.status !== 'Preparing' && (
					<div children="Відео на даний момент не доступно!" />
				)}

				{videoState.isDisabled && video.status === 'Preparing' && (
					<div children="Відео знаходиться на обробці!" />
				)}
			</div>

			<div
				className={`absolute transition-all duration-200 bottom-0 w-full bg-background/60 text-secondary-foreground p-3 flex flex-col gap-y-3.5 ${
					videoState.showNavigationMenu && !videoState.isDisabled && hls
						? 'opacity-100'
						: 'opacity-0'
				}`}
			>
				<SliderPrimitive.Root
					defaultValue={[0]}
					min={0}
					max={videoState.duration}
					value={[videoState.currentTime]}
					step={0.5}
					onValueChange={event => onTimeUpdateHandler(event[0])}
					className="relative flex w-full touch-none select-none items-center group py-1"
				>
					<SliderPrimitive.Track
						className="relative w-full grow overflow-hidden rounded-full bg-card flex items-center justify-center h-1 hover:cursor-pointer">
						<div className="absolute h-1 w-full">
							<div
								className="absolute h-1 bg-primary"
								style={{
									width: `${(videoState.currentTime / videoState.duration) * 100}%`,
									left: 0
								}}
							/>
							<div
								className="absolute h-1 bg-input"
								style={{
									width: `${(videoState.bufferedCount / videoState.duration) * 100}%`,
									left: `${(videoState.currentTime / videoState.duration) * 100}%`
								}}
							/>
						</div>
					</SliderPrimitive.Track>
					<SliderPrimitive.Thumb
						className="block size-2.5 group-hover:size-4 transition-all duration-100 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" />
				</SliderPrimitive.Root>

				<TooltipProvider delayDuration={0}>
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-1.5">
							{video.prevId && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={getVideoUrl(
												video.prevId,
												undefined,
												query?.listId ? (query.listId as string) : undefined,
												true
											)}
										>
											<DynamicIcon
												name="chevron-right"
												className="rotate-180"
											/>
										</Link>
									</TooltipTrigger>
									<TooltipContent children="Попереднє відео" />
								</Tooltip>
							)}

							<Tooltip>
								<TooltipTrigger
									onClick={() => togglePlay()}
									children={
										<DynamicIcon
											name={
												videoRef.current && videoRef.current.paused
													? 'play'
													: 'pause'
											}
										/>
									}
								/>
								<TooltipContent
									children={
										videoRef.current && videoRef.current.paused
											? 'Грати'
											: 'Пауза'
									}
								/>
							</Tooltip>
							{video.nextId && (
								<Tooltip>
									<TooltipTrigger asChild>
										<Link
											href={getVideoUrl(
												video.nextId,
												undefined,
												query?.listId ? (query.listId as string) : undefined,
												true
											)}
										>
											<DynamicIcon name="chevron-right" />
										</Link>
									</TooltipTrigger>
									<TooltipContent children="Наступне відео" />
								</Tooltip>
							)}

							<div className="group/volume flex items-center gap-x-1.5">
								<Tooltip>
									<TooltipTrigger
										onClick={toggleMute}
										children={
											<DynamicIcon
												name={
													videoState.volume === 0
														? 'volume-x'
														: videoState.volume < 0.4
															? 'volume'
															: videoState.volume < 0.7
																? 'volume-1'
																: videoState.volume < 1 ||
																videoState.volume === 1
																	? 'volume-2'
																	: 'volume-x'
												}
											/>
										}
									/>
									<TooltipContent
										children={
											videoState.volume === 0
												? 'Увімкнути звук'
												: 'Вимкнути звук'
										}
									/>
								</Tooltip>
								<div
									className="transition-all duration-200 ease-linear opacity-100 md:opacity-0 w-14 md:w-0 group-hover/volume:opacity-100 group-hover/volume:w-14">
									<Slider
										defaultValue={[0.5]}
										min={0}
										max={1}
										step={0.01}
										value={[videoState.volume]}
										thumbClassName="size-3.5"
										rangeClassName="h-0.5"
										trackClassName="flex items-center justify-center h-0.5"
										className="w-16 group-hover/volume:flex pr-2"
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
							{video.nextId && (
								<Tooltip>
									<TooltipTrigger
										asChild
										className="flex items-center"
										children={
											<Switch
												className={
													videoState.autoPlayNext ? 'bg-primary' : 'bg-input'
												}
												checked={videoState.autoPlayNext}
												onCheckedChange={toggleAutoPlayNext}
											/>
										}
									/>
									<TooltipContent
										children={`Автопрогравання (${
											videoState.autoPlayNext ? 'увімкнено' : 'вимкнено'
										})`}
									/>
								</Tooltip>
							)}

							<Tooltip>
								<TooltipTrigger
									className="flex items-center hiddenOnMobile"
									asChild
									children={
										<button
											onClick={() => setCinemaMode(p => !p)}
											children={
												<DynamicIcon
													name={cinemaMode ? 'monitor-x' : 'monitor-dot'}
												/>
											}
										/>
									}
								/>
								<TooltipContent
									children={
										cinemaMode ? 'Вийти з широкого екрану' : 'Широкий екран'
									}
								/>
							</Tooltip>

							<HoverCard>
								<HoverCardTrigger>
									<DynamicIcon name="settings" />
								</HoverCardTrigger>

								<HoverCardContent
									side={isOpen ? 'bottom' : 'top'}
									align="end"
									className="flex flex-col gap-y-2"
								>
									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center space-x-2">
												<DynamicIcon name="gauge" className="h-4 w-4" />
												<div children={`Швидкість: ${videoState.speed}x`} />
											</div>
										</TooltipTrigger>
										<TooltipContent side="left" align="end">
											<div
												className="flex flex-col gap-y-2"
												children={[0.5, 1, 2].map((value, index) => (
													<Button
														key={index}
														size="sm"
														variant={
															value === videoState.speed
																? 'secondary'
																: 'outline'
														}
														className="w-40"
														children={`${value}x`}
														onClick={() => changeSpeed(value)}
													/>
												))}
											/>
											<TooltipArrow className="w-3 h-2" />
										</TooltipContent>
									</Tooltip>

									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center space-x-2">
												<DynamicIcon name="settings-2" className="h-4 w-4" />
												<div>
													{videoState?.levels?.[videoState.selectedLevel]
														?.height
														? `Якість: ${videoState?.levels?.[videoState.selectedLevel]?.height}p`
														: 'Якість: автоматична'}
												</div>
											</div>
										</TooltipTrigger>
										<TooltipContent side="left" align="end">
											<div className="flex flex-col gap-y-2">
												{videoState?.levels?.map((value, index) => (
													<Button
														key={index}
														size="sm"
														variant={
															index === videoState.selectedLevel
																? 'secondary'
																: 'outline'
														}
														className="w-40"
														children={`${value.height}p`}
														onClick={() => changeQuality(index)}
													/>
												))}
												<Button
													key="auto"
													size="sm"
													variant={
														-1 === videoState.selectedLevel
															? 'secondary'
															: 'outline'
													}
													className="w-40"
													children="Автоматичний"
													onClick={() => changeQuality(-1)}
												/>
											</div>
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
									children={
										<DynamicIcon
											name={videoState.isFullScreen ? 'shrink' : 'maximize-2'}
										/>
									}
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
