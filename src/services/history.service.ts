import { IPagination, IHistoryVideosResponse } from '@/interfaces'
import { $axios } from '@/api/axios'

export const HistoryService = {
	createHistoryRecord(data: { videoId: string }) {
		return $axios.post('history/record', data)
	},
	deleteHistoryRecord(videoId: string) {
		return $axios.delete(`history/video/${videoId}`)
	},
	async getAllHistory(params: IPagination & { query?: string }) {
		return $axios.get<IHistoryVideosResponse>(`history`, { params })
	},
	deleteAllHistory() {
		return $axios.delete(`history`)
	},
	async switchHistoryMode(enabled: boolean = true) {
		return await $axios.post('history/switch-watch-history', { enabled })
	},
	async getHistorySettings() {
		return await $axios.get('history/settings')
	}
}
