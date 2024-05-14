interface IChannel {
	id: string
	name: string
	nickName: string
	profileImg: string
	createdAt?: string
	videosCount?: number
	description?: string
	profileBgImg?: string
	videosViewsCount?: number
	subscribersCount?: number
}

export type { IChannel }
