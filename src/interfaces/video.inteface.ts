import { ICreator, IVideoMetadataResponse } from './'

interface IVideo {
	id: string
	creatorId?: string
	title: string
	description?: string
	videoMetadata?: IVideoMetadataResponse
	visibility?: VideoVisibilityType
	status?: VideoStatusType
	creator?: ICreator
	lengthSeconds: number
	thumbnailUrl?: string
	previewThumbnailUrl?: string
	processedVideos: IProcessedVideo[]
	metrics?: IVideoMetrics
	processingStatus?: VideoProcessingStatusType
	tags?: string[]
	thumbnails?: IVideoThumbnail[]
	thumbnailId?: string
	thumbnailStatus?: VideoThumbnailStatusType
	videoPreviewThumbnail?: IVideoPreviewThumbnail
	createdAt?: string
	updatedAt?: string
	nextId?: string;
	prevId?: string
}

interface IVideoMetrics {
	videoId?: string
	viewsCount: string
	commentsCount: string
	likesCount: string
	dislikesCount: string
}

interface IProcessedVideo {
	id: string
	label: string
	url: string
	videoFileId?: string
	videoId?: string
	width?: number
	height?: number
	size?: string
}

interface IVideoThumbnail {
	imageFileId: string
	url: string
	videoId?: string
}

interface IVideoPreviewThumbnail {
	imageFileId?: string
	url: string
	videoId?: string
}

type VideoStatusType =
	| 'Created'
	| 'Registered'
	| 'RegistrationFailed'
	| 'Unregistered'

type VideoVisibilityType = 'Private' | 'Unlisted' | 'Public'

type VideoProcessingStatusType =
	| 'WaitingForUserUpload'
	| 'VideoUploaded'
	| 'VideoBeingProcessed'
	| 'VideoProcessed'
	| 'VideoProcessingFailed'

type VideoThumbnailStatusType = 'Waiting' | 'Processed'

interface IReportVideoReason {
	id: number
	name: string
}

export type { IVideo, IReportVideoReason, IProcessedVideo, VideoVisibilityType }
