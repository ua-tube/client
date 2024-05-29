import { $axios } from '@/api/axios'
import { IPagination, IComment } from '@/interfaces'

export const CommunityService = {
	async getCommentsByVideo(videoId: string, params: IPagination) {
		return $axios.get<any>(`community/comments/${videoId}`, { params })
	},
	async getCommentsByVideoV2(videoId: string, params: IPagination) {
		return $axios.get<any>(`community/${videoId}`, { params })
	},
	async getCommentsVotesByVideo(videoId: string) {
		return $axios.get<{ dislikedCommentIds: any[], likedCommentIds: any[] }>(`community/comments/votes/${videoId}`)
	},
	commentVote(data: { videoId: string, commentId: string, voteType: 'Like' | 'Dislike' | 'None' }) {
		return $axios.post('community/comments/votes', data)
	},
	createComment(data: { videoId: string, comment: string }) {
		return $axios.post<IComment>(`community/comments`, data)
	},
	createCommentReply(data: { videoId: string, comment: string, parentCommentId: string }) {
		return $axios.post<IComment>(`community/comments/replies`, data)
	},
	updateComment(data: { videoId: string, comment: string }) {
		return $axios.put<IComment>(`community/comments`, data)
	},
	deleteComment(commentId: string) {
		return $axios.delete<IComment>(`community/comments/${commentId}`)
	}
}
