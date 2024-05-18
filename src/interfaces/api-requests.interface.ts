interface ISignUpRequest {
	email: string
	password: string
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
	ILoginRequest,
	ISignUpRequest,
	ICreateCreatorRequest,
	IRecoveryPassRequest
}