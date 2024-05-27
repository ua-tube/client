import { IHomePageVideosResponse, IVideo } from '@/interfaces'
import { $axios } from '@/api/axios'

export const VideoService = {
	async getHomePageVideos(page = '1', perPage = '32') {
		return $axios.get<IHomePageVideosResponse>('search/latest', { params: { page, perPage } })
	},
	async getVideo(videoId: string) {
		return $axios.get<IVideo>(`video-store/videos/${videoId}`)
	}
}
