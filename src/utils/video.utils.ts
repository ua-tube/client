const getVideoUrl = (videoId?: string, time?: number, isShort = false) =>
	`${isShort ? '' : process.env.SERVER_URL}/watch?videoId=${videoId}${time ? `&time=${time}` : ''}`

const writeVideoUrl = async (videoId?: string, time?: number) => await navigator.clipboard.writeText(getVideoUrl(videoId, time))

const getSourceVideoUrl = (videoId: string, quality: string = '144p') => `${process.env.SERVER_URL}/videos/${videoId}/${quality}.mp4`

const formatNumbers = (v: number) => Intl.NumberFormat(undefined, { notation: 'compact' }).format(v)


export { writeVideoUrl, getSourceVideoUrl, formatNumbers, getVideoUrl }