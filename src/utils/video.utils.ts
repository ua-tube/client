import { getVideoUrl } from './'

const writeVideoUrl = async (videoId?: string, time?: number) =>
	await navigator.clipboard.writeText(getVideoUrl(videoId, time))

const formatNumbers = (v: string | number = '0', locale = 'uk') =>
	Intl.NumberFormat(locale, { notation: 'compact' }).format(+v)

export { writeVideoUrl, formatNumbers }
