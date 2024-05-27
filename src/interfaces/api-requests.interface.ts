interface ISignUpRequest {
	email: string
	password: string
}

interface IPagination {
	page: string | number
	perPage: string | number
}

interface ILoginRequest {
	login: string
	password: string
}

interface IRecoveryPassRequest {
	email: string
}

interface ICreateCreatorRequest {
	displayName: string
	nickname: string
}


export type {
	IPagination,
	ILoginRequest,
	ISignUpRequest,
	ICreateCreatorRequest,
	IRecoveryPassRequest
}
