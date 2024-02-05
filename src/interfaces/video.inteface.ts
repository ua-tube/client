import { IChannel } from './'

interface IVideo {
	id: string
	title: string
	channel: IChannel
	qualities?: string[]
	likesCount?: number
	disLikesCount?: number
	nextVideoId?: string
	description?: string
	commentsCount?: number
	views: number
	postedAt: string
	duration: number
	thumbnailUrl: string
	videoUrl: string
}

interface IReportReason {
	id: number
	name: string
}

export type { IVideo, IReportReason }