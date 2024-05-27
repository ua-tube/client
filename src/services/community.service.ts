import { $axios } from '@/api/axios'
import { IPagination } from '@/interfaces'


export const CommunityService = {
	async getCommentsByVideo(videoId: string, params: IPagination) {
		return $axios.get<any>(`community/comments/${videoId}`, { params })
	},

}
