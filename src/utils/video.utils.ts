import { getVideoUrl } from './'
import { IHistoryVideo, VideoProcessingStatusType } from '@/interfaces'

const writeVideoUrl = async (videoId?: string, time?: number) =>
	await navigator.clipboard.writeText(getVideoUrl(videoId, time))

const formatNumbers = (v: string | number = '0', locale = 'uk') =>
	Intl.NumberFormat(locale, { notation: 'compact' }).format(+v)

const parseTimestamps = (text?: string) =>
	text?.split('\n').map(line => {
		const [time, title] = line.split(' - ')
		const [minutes, seconds] = time.split(':').map(Number)
		const totalSeconds = minutes * 60 + seconds
		return { time: totalSeconds, title }
	})

const groupByDate = (historyVideos: IHistoryVideo[]) => {
	const grouped: { [key: string]: IHistoryVideo[] } = {}
	const lastViewTimes: { [key: string]: string } = {}

	historyVideos.forEach(video => {
		const date = video.viewAt.split('T')[0]
		if (!grouped[date]) {
			grouped[date] = []
			lastViewTimes[date] = video.viewAt
		}
		grouped[date].push({ ...video.video, creator: video.creator } as any)
		if (new Date(video.viewAt) > new Date(lastViewTimes[date])) {
			lastViewTimes[date] = video.viewAt
		}
	})

	return Object.keys(grouped).map(
		date =>
			({
				date: lastViewTimes[date],
				videos: grouped[date]
			}) as any
	)
}

const getVideoProcessingStatus = (
	processingStatus: VideoProcessingStatusType,
	t: (s: string) => string
) => {
	switch (processingStatus) {
		case 'WaitingForUserUpload':
			return t('status.uploadVideo')
		case 'VideoProcessed':
			return t('status.VideoProcessed')
		case 'VideoUploaded':
			return t('status.VideoUploaded')
		case 'VideoProcessingFailed':
			return t('status.VideoProcessingFailed')
		case 'VideoBeingProcessed':
			return t('status.VideoBeingProcessed')
		default:
			return t('status.unknownStatus')
	}
}

export {
	writeVideoUrl,
	formatNumbers,
	parseTimestamps,
	groupByDate,
	getVideoProcessingStatus
}
