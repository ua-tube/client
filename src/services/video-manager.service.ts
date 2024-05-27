import { IDashboardVideosResponse, IVideo, IPagination } from '@/interfaces'
import { $axios } from '@/api/axios'

export const VideoManagerService = {
	async createNewVideo(data: Partial<Pick<IVideo, 'title' | 'description'>>) {
		return $axios.post<IVideo>('video-manager/videos', data)
	},
	async updateVideo(
		videoId: string,
		data: Partial<Pick<IVideo, 'title' | 'description' | 'tags' | 'visibility' | 'thumbnailId'>>
	) {
		return $axios.put<IVideo>(`video-manager/videos/${videoId}`, data)
	},
	async getVideos(params: IPagination) {
		return $axios.get<IDashboardVideosResponse>('video-manager/videos', { params })
	},
	getVideo(videoId: string) {
		return $axios.get<IVideo>(`video-manager/videos/${videoId}`)
	},
	getVideoUploadToken(videoId: string) {
		return $axios.get<{ token: string }>(`video-manager/videos/${videoId}/upload-token`)
	}
}
