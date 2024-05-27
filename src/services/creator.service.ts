import { ICreateCreatorRequest, ICreator } from '@/interfaces'
import { $axios } from '@/api/axios'

export const CreatorService = {
	async createCreator(formData: ICreateCreatorRequest, accessToken: string) {
		return $axios.post<ICreator>('creators', formData, {
			headers: { Authorization: `Bearer ${accessToken}` }
		})
	},
	getCreatorByUserId(userId: string, accessToken?: string) {
		return $axios.get('creators', {
			params: { userId },
			...(accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: {})
		})
	},
	getCreatorBySelf(accessToken?: string) {
		return $axios.get<ICreator>(
			'creators/self',
			accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined
		)
	},
	updateCreator(
		data: Partial<Pick<ICreator, 'displayName' | 'nickname'>> & {
			thumbnailToken?: string
		},
		accessToken?: string
	) {
		return $axios.put<ICreator>(
			'creators',
			data,
			accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined
		)
	}
}
