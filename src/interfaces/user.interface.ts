import { ICreator } from './'

interface IUser {
	id: string
	email: string
	creator: ICreator
}

export type { IUser }
