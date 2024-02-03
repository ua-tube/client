const writeVideoUrl = async (videoId?: string, time?: number) =>
	await navigator.clipboard.writeText(`${process.env.SERVER_URL}/watch/${videoId}${time ? `?time=${time}` : ''}`)

const getUrlForVideo = (videoId: string, quality: string = '144p') => `${process.env.SERVER_URL}/videos/${videoId}/${quality}.mp4`

const formatNumbers = (v: number) => Intl.NumberFormat(undefined, { notation: 'compact' }).format(v)


export { writeVideoUrl, getUrlForVideo , formatNumbers}