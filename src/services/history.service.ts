import { $axios } from '@/api/axios'
import { IPagination } from '@/interfaces'

export const HistoryService = {
	createHistoryRecord(data: { videoId: string }) {
		return $axios.post('history/record', data)
	},
	deleteHistoryRecord(videoId: string) {
		return $axios.delete(`history/record/${videoId}`)
	},
	async getAllHistory(params: IPagination & { query?: string }) {
		return $axios.get(`history`, { params })
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
