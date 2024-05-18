import { IUser } from '@/interfaces'

interface IAuthState {
	loading: boolean
	user?: IUser
	accessToken?: string
}

interface ISignUpData {
	firstName: string
	lastName: string
	email: string
	phone: string
	password: string
	passwordRepeat: string
}

interface ILoginData {
	login: string
	password: string
}

export type { ILoginData, ISignUpData, IAuthState }
