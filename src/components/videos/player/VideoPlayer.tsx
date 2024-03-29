import { FC, useCallback, useEffect, useRef, useState } from 'react'
import { IVideo, IVideoState, UseState } from '@/interfaces'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { useSidebarContext } from '@/providers'
import { useRouter } from 'next/router'
import { videoSpeeds } from '@/data'
import Link from 'next/link'
import {
	formatDuration,
	getAllElementsFromOrToCurrentElement,
	getSourceVideoUrl,
	writeVideoUrl,
	getVideoUrl,
	cn
} from '@/utils'
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


interface IVideoPlayerProps {
	video: IVideo
	videoIds: { next: string, prev?: string }
	autoPlay?: boolean
	cinemaMode: boolean
	setCinemaMode: UseState<boolean>
}

const VideoPlayer: FC<
	IVideoPlayerProps
> = ({
			 video,
			 videoIds,
			 autoPlay,
			 setCinemaMode,
			 cinemaMode
		 }) => {
	const [videoState, setVideoState] = useState<IVideoState>({
		autoPlayNext: false,
		isLooped: false,
		duration: 0,
		isLoading: true,
		quality: video.qualities?.at(-1) || '144p',
		speed: 1,
		volume: 0.5,
		isFullScreen: false,
		currentTime: 0,
		bufferedCount: 0,
		showAnimation: false,
		showNavigationMenu: true,
		disabledQualities: [],
		isDisabled: false
	})
	const videoRef = useRef<HTMLVideoElement>(null)
	const divRef = useRef<HTMLDivElement>(null)
	const { push, query } = useRouter()
	const { isOpen } = useSidebarContext()

	const showPlayAnimation = useCallback(() => {
		setVideoState((s) => ({ ...s, showAnimation: true }))
		setTimeout(() =>
			setVideoState(
				(s) => ({ ...s, showAnimation: false })
			), 1000)
	}, [setVideoState])


	const togglePlay = useCallback((disableAnimation?: boolean) => {
		if (!videoState.isDisabled)
			if (videoRef.current) {
				if (videoRef.current.paused) {
					videoRef.current.play().catch()
					!disableAnimation && showPlayAnimation()
				} else {
					videoRef.current.pause()
					!disableAnimation && showPlayAnimation()
				}
			}

	}, [showPlayAnimation, videoState.isDisabled])

	const changeSpeed = useCallback((newSpeed: number) => {
		if (videoRef.current) {
			videoRef.current.playbackRate = newSpeed
			setVideoState(p => ({ ...p, speed: newSpeed }))
		}
	}, [setVideoState])

	const onTimeUpdateHandler = useCallback((time?: number) => {
		if (videoRef.current) {
			if (time) videoRef.current.currentTime = time
			setVideoState(p => ({ ...p, currentTime: videoRef.current!.currentTime }))
		}
	}, [setVideoState])

	const changeQuality = useCallback((newQuality: string) => {
		if (videoRef.current) {
			setVideoState(p => ({ ...p, quality: newQuality }))
			setTimeout(async () => {
				onTimeUpdateHandler(videoState.currentTime)
				await videoRef.current?.play()
			}, 100)
		}
	}, [onTimeUpdateHandler, videoState.currentTime, setVideoState])

	const changeVolume = useCallback((volume: number) => {
		if (videoRef.current && (volume < 1.01 && volume > -0.01)) {
			videoRef.current.volume = volume
			setVideoState(p => ({ ...p, volume }))
			sessionStorage.setItem('volume', `${volume}`)
		}
	}, [setVideoState])

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
	}, [videoState.isFullScreen, setVideoState])


	const onVideoEnd = useCallback(async () => {
			if (videoState.autoPlayNext && videoState.isLooped && videoRef.current) {
				videoRef.current.loop = false
				setVideoState(p => ({ ...p, isLooped: false }))
			}
			if (videoState.autoPlayNext)
				await push(getVideoUrl(videoIds.next, undefined,
					query?.listId ? query.listId as string : undefined,
					true)
				)
		},
		[videoState.autoPlayNext, push, videoIds.next, query.listId, videoState.isLooped, setVideoState])

	const onVideoLoadError = useCallback(() => {
		const disabledQualities = getAllElementsFromOrToCurrentElement(video.qualities!, videoState.quality, true)
		setVideoState(p => ({ ...p, disabledQualities, isDisabled: disabledQualities.length === video.qualities?.length }))
		changeQuality(getAllElementsFromOrToCurrentElement(video.qualities!, videoState.quality).at(-1) || '144p')
	}, [videoState.quality, changeQuality, video.qualities, setVideoState])

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
		sessionStorage.setItem('autoPlayNext', `${Number(!videoState.autoPlayNext)}`)
		setVideoState(p => ({ ...p, autoPlayNext: !p.autoPlayNext }))
	}, [videoState.isLooped, toggleRepeat, setVideoState, videoState.autoPlayNext])


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
			setVideoState(p => ({
				...p,
				bufferedCount: bufferedTotal(),
				isLoading: p.currentTime + 1 > bufferedTotal()
			}))
		}
	}, [videoState.currentTime, setVideoState])

	const buttonsCallBack = useCallback((event: KeyboardEvent) => {
		switch (event.key) {
			case 'а':
			case 'f':
			case 'А':
			case 'F':
				toggleFullScreen()
				break
			case ' ':
				togglePlay()
				break
			case 'ь':
			case 'm':
			case 'Ь':
			case 'M':
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
	}, [videoState.isFullScreen, setVideoState])


	const onLoadingListener = useCallback(
		(loading: boolean) => setVideoState(p => ({ ...p, isLoading: loading })),
		[setVideoState])

	useEffect(() => {
		document.addEventListener('keydown', buttonsCallBack)
		document.addEventListener('fullscreenchange', fullScreenChangeListener)
		if (videoRef.current) {
			videoRef.current.addEventListener('loadstart', () => onLoadingListener(true))
			videoRef.current.addEventListener('loadeddata', () => onLoadingListener(false))
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
				videoRef.current.removeEventListener('loadstart', () => onLoadingListener(true))
				videoRef.current.removeEventListener('loadeddata', () => onLoadingListener(false))
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
		autoPlay && togglePlay(true)
	}, [video])

	return (<div
			ref={divRef}
			onMouseEnter={() => setVideoState((s) => ({ ...s, showNavigationMenu: true }))}
			onMouseLeave={() => !videoRef.current?.paused && setVideoState((s) => ({ ...s, showNavigationMenu: false }))}
			onDoubleClick={toggleFullScreen}
			className={cn('group/main relative',
				!cinemaMode ? 'rounded-lg' : 'h-[80vh] mb-4 bg-black/80',
				cinemaMode && !videoState.isFullScreen && ' border-b-2'
			)}
		>
			<ContextMenu>
				<ContextMenuTrigger className="size-full flex items-center justify-center overflow-y-hidden">
					<video
						ref={videoRef}
						className={cn('bg-black/80 ', !cinemaMode ? ' w-full aspect-video rounded-lg' : 'h-full object-center')}
						onClick={() => togglePlay()}
						onError={onVideoLoadError}
						src={getSourceVideoUrl(video.id, videoState.quality)}
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
							<DynamicIcon name="arrow-right-circle" />
							<span children="Автопрогравання" />
						</div>
						{videoState.autoPlayNext && <div className="checkedIcon" />}
					</ContextMenuItem>

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
						onClick={() => writeVideoUrl(video.id, Math.floor(videoState.currentTime))}
					>
						<div className="items-center flex space-x-2">
							<DynamicIcon name="link" />
							<span children="Копіювати URL-адресу з цього часу" />
						</div>
					</ContextMenuItem>
				</ContextMenuContent>

			</ContextMenu>

			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-3">
				{videoState.showAnimation && !videoState.isLoading && <DynamicIcon
					name={videoRef.current && videoRef.current.paused ? 'pause-circle' : 'play-circle'}
					className="animate-ping delay-100 duration-1000 transition-all size-14 bg-black/60 rounded-full"
				/>}
				{videoState.isLoading && !videoState.isDisabled &&
					<DynamicIcon
						name="loader-2"
						className="animate-spin transition-all size-14 bg-black/60 rounded-full"
					/>}
				{videoState.isDisabled && <div children="Відео на даний момент не доступно!" />}
			</div>

			<div
				className={`absolute transition-all duration-200 bottom-0 w-full bg-background/60 text-secondary-foreground p-3 flex flex-col gap-y-3.5 ${
					videoState.showNavigationMenu && !videoState.isDisabled ?
						'opacity-100' :
						'opacity-0'}`}>

				<SliderPrimitive.Root
					defaultValue={[0]}
					min={0}
					max={videoState.duration}
					value={[videoState.currentTime]}
					step={1}
					onValueChange={event => onTimeUpdateHandler(event[0])}
					className="relative flex w-full touch-none select-none items-center group py-1"
				>
					<SliderPrimitive.Track
						className="relative w-full grow overflow-hidden rounded-full bg-card flex items-center justify-center h-1 hover:cursor-pointer"
					>
						<div className="absolute h-1 w-full">
							<div
								className="absolute h-1 bg-primary"
								style={{ width: `${(videoState.currentTime / videoState.duration) * 100}%`, left: 0 }}
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
						className="block size-2.5 group-hover:size-4 transition-all duration-100 rounded-full border-2 border-primary bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					/>
				</SliderPrimitive.Root>


				<TooltipProvider delayDuration={0}>
					<div className="flex justify-between items-center">
						<div className="flex items-center space-x-1.5">

							{videoIds.prev && <Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={getVideoUrl(videoIds.prev, undefined, query?.listId ? query.listId as string : undefined, true)}>
										<DynamicIcon name="chevron-right" className="rotate-180" />
									</Link>
								</TooltipTrigger>
								<TooltipContent children="Попереднє відео" />
							</Tooltip>
							}

							<Tooltip>
								<TooltipTrigger
									onClick={() => togglePlay()}
									children={<DynamicIcon name={videoRef.current && videoRef.current.paused ? 'play' : 'pause'} />} />
								<TooltipContent children={videoRef.current && videoRef.current.paused ? 'Грати' : 'Пауза'} />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Link
										href={getVideoUrl(videoIds.next, undefined, query?.listId ? query.listId as string : undefined, true)}>
										<DynamicIcon name="chevron-right" />
									</Link>
								</TooltipTrigger>
								<TooltipContent children="Наступне відео" />
							</Tooltip>

							<div className="group/volume flex items-center gap-x-1.5">
								<Tooltip>
									<TooltipTrigger
										onClick={toggleMute}
										children={
											<DynamicIcon
												name={
													videoState.volume === 0 ?
														'volume-x' :
														videoState.volume < 0.4 ?
															'volume' :
															videoState.volume < 0.7 ?
																'volume-1' :
																(videoState.volume < 1 || videoState.volume === 1)
																	? 'volume-2'
																	: 'volume-x'
												} />
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
									asChild
									className="flex items-center"
									children={
										<Switch
											className={videoState.autoPlayNext ? 'bg-primary' : 'bg-input'}
											checked={videoState.autoPlayNext}
											onCheckedChange={toggleAutoPlayNext}
										/>
									} />
								<TooltipContent
									children={`Автопрогравання (${
										videoState.autoPlayNext ?
											'увімкнено' :
											'вимкнено'
									})`} />
							</Tooltip>

							<Tooltip>
								<TooltipTrigger
									className="flex items-center hiddenOnMobile"
									asChild
									children={
										<button
											onClick={() => setCinemaMode(p => !p)}
											children={<DynamicIcon name={cinemaMode ? 'monitor-x' : 'monitor-dot'} />}
										/>
									} />
								<TooltipContent children={cinemaMode ? 'Вийти з широкого екрану' : 'Широкий екран'} />
							</Tooltip>

							<HoverCard>
								<HoverCardTrigger>
									<DynamicIcon name="settings" />
								</HoverCardTrigger>

								<HoverCardContent side={isOpen ? 'bottom' : 'top'} align="end" className="flex flex-col gap-y-2">

									<Tooltip>
										<TooltipTrigger>
											<div className="flex items-center space-x-2">
												<DynamicIcon name="gauge" className="h-4 w-4" />
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
												<DynamicIcon name="settings-2" className="h-4 w-4" />
												<div children={`Якість: ${videoState.quality}`} />
											</div>
										</TooltipTrigger>
										<TooltipContent side="left" align="end">
											<div
												className="flex flex-col gap-y-2"
												children={video.qualities?.map((value, index) =>
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
									children={<DynamicIcon name={videoState.isFullScreen ? 'shrink' : 'maximize-2'} />}
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
