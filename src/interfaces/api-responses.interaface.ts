import { IUser } from '@/interfaces/user.interface'

interface IErrorResponse {
	status?: number
	code?: number
	message?: string
	timestamp?: string
	path?: string
}

interface IBaseResponse<T> extends IErrorResponse {
	data: T
}

interface ICsrfTokenResponse extends IBaseResponse<{ token: string }> {}

interface ILoginResponse {
	user: IUser
	accessToken: string
}

export type {
	IBaseResponse,
	IErrorResponse,
	ICsrfTokenResponse,
	ILoginResponse
}
