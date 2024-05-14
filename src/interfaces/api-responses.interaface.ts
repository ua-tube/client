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

export type { IBaseResponse, IErrorResponse, ICsrfTokenResponse }
