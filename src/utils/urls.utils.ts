const getVideoUrl = (
	videoId?: string,
	time?: number,
	listId?: string,
	isShort = false
) =>
	`${isShort ? '' : process.env.SERVER_URL}/watch?videoId=${videoId}${listId ? `&listId=${listId}` : ''}${time ? `&time=${time}` : ''}`

const getDashboardVideoUrl = (
	videoId: string,
	tab: 'edit' | 'comments' = 'edit'
) => `/dashboard/videos/${videoId}?tab=${tab}`

const getChannelUrl = (
	nickName: string = '',
	menuItem?: 'index' | 'videos' | 'playlists',
	isShort = true
) =>
	`${isShort ? '' : process.env.SERVER_URL}/channel/${nickName}${menuItem ? `?tab=${menuItem}` : ''}`

const getPlaylistUrl = (listId?: string, isShort = false) =>
	`${isShort ? '' : process.env.SERVER_URL}/playlist?listId=${listId}`

const getSourceVideoUrl = (videoId: string, quality: string = '144p') =>
	`${process.env.SERVER_URL}/videos/${videoId}/${quality}.mp4`

export {
	getSourceVideoUrl,
	getVideoUrl,
	getChannelUrl,
	getPlaylistUrl,
	getDashboardVideoUrl
}
