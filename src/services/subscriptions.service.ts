import { $axios } from '@/api/axios'
import { ICreator, ISubscription } from '@/interfaces'

export const SubscriptionsService = {
	async subscribe(data: { targetId: string }) {
		return $axios.post(`subscriptions/subscribe`, data)
	},
	async unsubscribe(data: { targetId: string }) {
		return $axios.post(`subscriptions/unsubscribe`, data)
	},
	async checkSubscription(targetId: string) {
		return $axios.get<{ status: boolean }>(`/subscriptions/status/${targetId}`)
	},
	async getSubscriptionInfo(creatorId: string) {
		return $axios.get<ICreator>(`/subscriptions/info/${creatorId}`)
	},
	async getSubscriptions() {
		return $axios.get<ISubscription[]>(`subscriptions`)
	}
}
