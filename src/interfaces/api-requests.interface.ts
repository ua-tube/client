import { VideoVisibilityType, IUser } from './'

interface ISignUpRequest {
	email: string
	password: string
}

interface IPagination {
	page: string | number
	perPage: string | number
}

interface ILoginRequest {
	accessToken: string
	user:IUser
}

interface IRecoveryPassRequest {
	email: string
}

interface ICreateCreatorRequest {
	displayName: string
	nickname: string
}

interface ICreatePlaylistsRequest {
	title: string
	description?: string
	visibility: VideoVisibilityType
}

interface ICreatorVideosRequest {
	creatorId: string
	page: number
	perPage: number
	sortBy?: string
	sortOrder?: string
}

export type {
	IPagination,
	ILoginRequest,
	ISignUpRequest,
	ICreatorVideosRequest,
	ICreateCreatorRequest,
	IRecoveryPassRequest,
	ICreatePlaylistsRequest
}
