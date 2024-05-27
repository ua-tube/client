import { IUser } from '@/interfaces/user.interface'
import { IVideo } from '@/interfaces/video.inteface'

interface IErrorResponse {
	statusCode?: number
	message?: string
	error?: string
}

interface ICsrfTokenResponse {
	token: string
}

interface ILoginResponse {
	user: IUser
	accessToken: string
}

interface IHomePageVideosResponse {
	hits: IVideo[]
	query: string
	processingTimeMs: number
	hitsPerPage: number
	page: number
	totalPages: number
	totalHits: number
	facetDistribution: { tags: any }
	facetStats: any
}

interface IStorageResponse {
	id: string
	groupId: string
	category: string
	filename: string
	originalFileName: string
	fileSize: number
	url: string
	userId: string
	createdAt: string
	token: string
}

interface IDashboardVideosResponse {
	videos: IVideo[]
	count: number
}

interface IRefreshAccessTokenResponse
	extends Pick<ILoginResponse, 'accessToken'> {}

export type {
	IErrorResponse,
	ICsrfTokenResponse,
	IStorageResponse,
	IHomePageVideosResponse,
	IRefreshAccessTokenResponse,
	IDashboardVideosResponse,
	ILoginResponse
}
