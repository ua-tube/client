import { IPlaylist, IUser, IVideo, UserVoteType } from './'

interface IErrorResponse {
	statusCode?: number
	code?: number
	message?: string
	error?: string
}

interface IApiPaginationResponse<T> {
	list: Array<T>
	pagination: {
		page: number
		pageCount?: number
		pageSize: number
		total?: number
	}
}

interface ICsrfTokenResponse {
	token: string
}

interface ILoginResponse {
	user: IUser
	accessToken: string
}

interface ISearchVideosResponse {
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

interface IDashboardVideosResponse extends IApiPaginationResponse<IVideo> {}

interface IRefreshAccessTokenResponse
	extends Pick<ILoginResponse, 'accessToken'> {}

interface IPlaylistsResponse extends IApiPaginationResponse<IPlaylist> {}

interface IVideoMetadataResponse {
	viewsCount: string
	likesCount: string
	dislikesCount: string
	userVote: UserVoteType
}

export type {
	IErrorResponse,
	ICsrfTokenResponse,
	IApiPaginationResponse,
	IPlaylistsResponse,
	IVideoMetadataResponse,
	IStorageResponse,
	ISearchVideosResponse,
	IRefreshAccessTokenResponse,
	IDashboardVideosResponse,
	ILoginResponse
}
