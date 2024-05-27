import { getVideoUrl } from './'

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

export { writeVideoUrl, formatNumbers, parseTimestamps }
