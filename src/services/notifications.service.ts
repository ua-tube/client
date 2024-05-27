import { INotification } from '@/interfaces'
import { $axios } from '@/api/axios'

export const NotificationsService = {
	async getAll() {
		return $axios.get<INotification[]>('notifications')
	},
	async deleteAll() {
		return $axios.delete('notifications/all')
	},
	async deleteById(id: string) {
		return $axios.delete(`notifications/by-id/${id}`)
	}
}
