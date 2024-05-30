import { IProcessedVideo } from '@/interfaces'

const getVideoUrlForQuality = (quality?: IProcessedVideo) =>
	`${process.env.STORAGE_SERVER_URL}${quality?.url}`

function generateM3U8Content(videos: IProcessedVideo[]): string {
	let m3u8Content = '#EXTM3U\n'
	videos.forEach(video => {
		m3u8Content += `#EXT-X-STREAM-INF:BANDWIDTH=${video.size || 0},RESOLUTION=${video.width}x${video.height},NAME="${video.label}"\n`
		m3u8Content += `${getVideoUrlForQuality(video)}\n`
	})
	return m3u8Content
}

function createM3U8BlobUrl(videos: IProcessedVideo[]): string {
	const m3u8Content = generateM3U8Content(videos)
	const blob = new Blob([m3u8Content], {
		type: 'application/vnd.apple.mpegurl'
	})
	return URL.createObjectURL(blob)
}

export { getVideoUrlForQuality, createM3U8BlobUrl, generateM3U8Content }
