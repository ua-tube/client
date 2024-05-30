import { ICreator } from './'

interface INotification {
	notificationId: string
	creatorId: string
	message: string
	url: string
	channel: Pick<ICreator, 'nickname' | 'thumbnailUrl'>
}

export type { INotification }
