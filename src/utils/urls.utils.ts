const FRONTEND_URL = process.env.FRONTEND_URL

const getVideoUrl = (
	videoId?: string,
	time?: number,
	listId?: string,
	isShort = false
) =>
	`${isShort ? '' : FRONTEND_URL}/watch?videoId=${videoId}${listId ? `&listId=${listId}` : ''}${time ? `&time=${time}` : ''}`

const getStudioVideoUrl = (
	videoId: string,
	tab: 'edit' | 'comments' = 'edit'
) => `/studio/videos/${videoId}?tab=${tab}`

const getChannelUrl = (
	nickName: string = '',
	menuItem: 'videos' | 'playlists' | string = 'videos',
	isShort = true
) => `${isShort ? '' : FRONTEND_URL}/channel/${nickName}/${menuItem}`

const getPlaylistUrl = (listId?: string, isShort = false) =>
	`${isShort ? '' : FRONTEND_URL}/playlist?listId=${listId}`

const getSourceVideoUrl = (videoId: string, quality: string = '144p') =>
	`${FRONTEND_URL}/videos/${videoId}/${quality}.mp4`

export {
	getSourceVideoUrl,
	getVideoUrl,
	getChannelUrl,
	getPlaylistUrl,
	getStudioVideoUrl
}
