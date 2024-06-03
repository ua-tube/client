import { ICreator, IVideoMetadataResponse } from './'

interface IVideo {
	_id?: string
	id: string
	creatorId?: string
	title: string
	description?: string
	masterPlaylistUrl?: string
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
	nextId?: string
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
	| 'Preparing'

type VideoVisibilityType = 'Private' | 'Unlisted' | 'Public'

type VideoProcessingStatusType =
	| 'WaitingForUserUpload'
	| 'VideoUploaded'
	| 'VideoBeingProcessed'
	| 'VideoProcessed'
	| 'VideoProcessingFailed'

type VideoThumbnailStatusType = 'Waiting' | 'Processed'

interface IHistoryVideo {
	creatorId: string
	videoId: string
	title: string
	tags: string
	viewAt: string
	creator: ICreator
	video: IVideo
}

export type { IVideo, IProcessedVideo, VideoVisibilityType, IHistoryVideo }
