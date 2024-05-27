import { ICreator } from './'

interface INotification {
	id: string
	message: string
	url: string
	channel?: ICreator
}

export type { INotification }
