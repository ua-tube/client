import { IChannel } from './'

interface IComment {
	id: string
	message: string
	createdAt: string
	likesCount: number
	disLikesCount: number
	chanel: IChannel
}

export type {IComment}