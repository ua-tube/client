import { IUser } from '@/interfaces/user.interface'

interface IErrorResponse {
	statusCode?: number
	message?: string
	error?: string
}

interface IBaseResponse<T> extends IErrorResponse {
	data: T
}

interface ICsrfTokenResponse extends IBaseResponse<{ token: string }> {
}

interface ILoginResponse {
	user: IUser
	accessToken: string
}

interface IRefreshAccessTokenResponse extends Pick<ILoginResponse, 'accessToken'> {
}

export type {
	IBaseResponse,
	IErrorResponse,
	ICsrfTokenResponse,
	IRefreshAccessTokenResponse,
	ILoginResponse
}
