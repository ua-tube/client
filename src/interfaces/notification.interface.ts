import { IChannel } from './'

interface INotification {
	id: string
	message: string
	url: string
	channel?: IChannel
}

export type { INotification }