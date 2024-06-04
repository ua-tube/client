import { IPagination, ISearchVideosResponse, IVideo } from '@/interfaces'
import { $axios } from '@/api/axios'

export const VideoService = {
	async getHomePageVideos(page = '1', perPage = '32') {
		return $axios.get<ISearchVideosResponse>('search/latest', {
			params: { page, perPage }
		})
	},
	async getSearchVideos(params: IPagination & { q: string }) {
		return $axios.get<ISearchVideosResponse>('search', { params })
	},
	async searchRelatedVideosByVideoId({
		videoId,
		...params
	}: IPagination & { videoId: string }) {
		return $axios.get(`search/related/${videoId}`, { params })
	},
	async searchVideosByTags(params: IPagination & { tags: string[] }) {
		return $axios.post<{ results: IVideo[] }>('search/by-tags', params)
	},
	async getVideo(videoId: string) {
		return $axios.get<IVideo>(`video-store/videos/${videoId}`)
	}
}
