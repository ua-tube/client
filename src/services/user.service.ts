import { $axios } from '@/api/axios'
import { IStorageResponse } from '@/interfaces'

export const UserService = {
	generateBannerToken(accessToken?: string) {
		return $axios.get<{ token: string }>(
			'users/banner/upload-token',
			accessToken
				? { headers: { Authorization: 'Bearer ' + accessToken } }
				: undefined
		)
	},
	generateThumbnailToken(accessToken?: string) {
		return $axios.get<IStorageResponse>(
			'users/thumbnail/upload-token',
			accessToken
				? { headers: { Authorization: 'Bearer ' + accessToken } }
				: undefined
		)
	},
	checkNicknameAvailable(nickname: string) {
		return $axios.get<{ availability: boolean }>('users/nickname-check', {
			params: { nickname }
		})
	}
}
