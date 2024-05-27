import { ICreator } from '@/interfaces/channel.interface'

interface IComment {
	id: string
	message: string
	createdAt: string
	likesCount: number
	chanel: ICreator
	children?: IComment[]
}

export type { IComment }
