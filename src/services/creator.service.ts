import { ICreateCreatorRequest, ICreator } from '@/interfaces'
import { $axios } from '@/api/axios'

export const CreatorService = {
	async createCreator(formData: ICreateCreatorRequest, accessToken: string) {
		return $axios.post<ICreator>('creators', formData, {
			headers: { Authorization: `Bearer ${accessToken}` }
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
	getCreatorByNicknameOrUserId(params: { nickname?: string, userId?: string }) {
		return $axios.get<ICreator>('creators', { params })
	},
	updateCreator(
		data: Partial<Pick<ICreator, 'displayName' | 'nickname'>> & {
			thumbnailToken?: string
			bannerToken?: string
		},
		accessToken?: string
	) {
		return $axios.patch<ICreator>(
			'creators',
			data,
			accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined
		)
	}
}
