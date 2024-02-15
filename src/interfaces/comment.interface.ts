import { IChannel } from './'

interface IComment {
	id: string
	message: string
	createdAt: string
	likesCount: number
	chanel: IChannel
	children?: IComment []
}

export type { IComment }