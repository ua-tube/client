import { IHomePageVideosResponse, IVideo, IPagination } from '@/interfaces'
import { $axios } from '@/api/axios'

export const VideoService = {
	async getHomePageVideos(page = '1', perPage = '32') {
		return $axios.get<IHomePageVideosResponse>('search/latest', {
			params: { page, perPage }
		})
	},
	async getSearchVideos(params: IPagination & { q: string }) {
		return $axios.get('search', { params })
	},
	async searchVideosByTags(params: IPagination & { tags: string[] }) {
		return $axios.get('search/by-tags', { params })
	},
	async getVideo(videoId: string) {
		return $axios.get<IVideo>(`video-store/videos/${videoId}`)
	}
}
