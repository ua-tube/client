import { $axios } from '@/api/axios'
import {
	ICreatePlaylistsRequest,
	ICreatorVideosRequest,
	IPagination,
	IPlaylist,
	IPlaylistsResponse,
	IVideoMetadataResponse,
	IVideo
} from '@/interfaces'

export const LibraryService = {
	async getPlaylistsByCreator(creatorId: string) {
		return $axios.get<IPlaylist[]>(`library/playlists/by-creator/${creatorId}`)
	},
	async getCurrVideoPlaylistIds(videoId: string) {
		return $axios.get<string[]>(`library/playlists/ids-where/${videoId}`)
	},
	async getAllVideosByPlaylist(params: IPagination & { t?: string }) {
		return $axios.get<IPlaylist>('library/playlists', { params })
	},
	async getVideos(params: ICreatorVideosRequest) {
		return $axios.get<IVideo[]>('library/videos', { params })
	},
	async getPlaylistIdsForVideo(videoId: string) {
		return $axios.get<string[]>(`library/playlists/ids-where/${videoId}`)
	},
	async getTotalVideosForCreator(creatorId: string) {
		return $axios.get<string>(`library/videos/count/${creatorId}`)
	},
	async getTotalVideoViewsForCreator(creatorId: string) {
		return $axios.get<string>(`library/videos/total-views/${creatorId}`)
	},
	async getPlaylistsBySelf(params?: IPagination) {
		return $axios.get<IPlaylistsResponse>('library/playlists/infos/self', {
			params
		})
	},
	async createPlaylist(data: ICreatePlaylistsRequest) {
		return $axios.post<IPlaylist>('library/playlists', data)
	},
	async addItemToPlaylist(data: { t: string; videoId: string }) {
		return $axios.post<IPlaylist>('library/playlists/add-item', data)
	},
	async removeItemToPlaylist(data: { t: string; videoId: string }) {
		return $axios.post<IPlaylist>('library/playlists/remove-item', data)
	},
	async updatePlaylist(data: Partial<ICreatePlaylistsRequest>) {
		return $axios.patch<IPlaylist>('library/playlists', data)
	},
	async deletePlaylist(playlistId: string) {
		return $axios.delete<IPlaylist>(`/library/playlists/${playlistId}`)
	},
	async getVideoMetadata(videoId: string, accessToken?: string) {
		return $axios.get<IVideoMetadataResponse>(
			`library/videos/${videoId}/metadata`,
			accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined
		)
	},
	async videoLikeOrDislike(
		data: { voteType: 'Like' | 'Dislike' | 'None'; videoId: string },
		accessToken?: string
	) {
		return $axios.post(
			`library/videos/vote`,
			data,
			accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined
		)
	}
}
