import { IUser } from '@/interfaces'

interface IAuthState {
	loading: boolean
	user?: IUser
	accessToken?: string
}

export type { IAuthState }
