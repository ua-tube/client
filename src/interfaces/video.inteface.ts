import { IChannel } from './'

interface IVideoState {
	speed: number
	quality: string
	volume: number
	duration: number
	bufferedCount: number
	isLoading: boolean
	currentTime: number
	autoPlayNext: boolean
	isFullScreen: boolean
	showNavigationMenu: boolean
	showAnimation: boolean
	isLooped: boolean
	cinemaMode: boolean
	disabledQualities: string[]
}


interface IVideo {
	id: string
	title: string
	channel: IChannel
	qualities?: string[]
	likesCount?: number
	disLikesCount?: number
	commentsCount?: number
	description?: string
	views: number
	postedAt: string
	duration: number
	thumbnailUrl: string
	videoUrl: string
	limits?: boolean
	visible?: 0 | 1 | 2
}

interface IReportReason {
	id: number
	name: string
}

export type { IVideo, IReportReason, IVideoState }