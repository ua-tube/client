import {
	IPlaylist,
	ICreatePlaylistsRequest,
	IPagination,
	IPlaylistsResponse,
	ICreatorVideosRequest
} from '@/interfaces'
import { $axios } from '@/api/axios'


export const LibraryService = {
	async getAll(params?: IPagination & { t?: string }) {
		return $axios.get<IPlaylistsResponse>('library/playlists', { params })
	},
	async getVideos(params: ICreatorVideosRequest) {
		return $axios.get('library/videos', { params })
	},
	
	async getPlaylistsBySelf(params?: IPagination) {
		return $axios.get<IPlaylistsResponse>('library/playlists/infos/self', { params })
	},
	async createPlaylist(data: ICreatePlaylistsRequest) {
		return $axios.post<IPlaylist>('library/playlists', data)
	},
	async addItemToPlaylist(data: { t: string, videoId: string }) {
		return $axios.post<IPlaylist>('library/playlists/add-item', data)
	},
	async removeItemToPlaylist(data: { t: string, videoId: string }) {
		return $axios.post<IPlaylist>('library/playlists/remove-item', data)
	},
	async updatePlaylist(data: Partial<ICreatePlaylistsRequest>) {
		return $axios.patch<IPlaylist>('library/playlists', data)
	},
	async deletePlaylist(playlistId: string) {
		return $axios.delete<IPlaylist>(`/library/playlists/${playlistId}`)
	},
	async getVideoMetadata(videoId: string, accessToken?: string) {
		return $axios.get(`library/videos/${videoId}/metadata`,
			accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
		)
	},
	async videoLikeOrDislike(data: { voteType: 'Like' | 'Dislike' | 'None', videoId: string }, accessToken?: string) {
		return $axios.post(`library/videos/vote`, data,
			accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined
		)
	}
}
