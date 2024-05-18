import { $axios } from '@/api/axios'

export const UserService = {
	async createCreator(data: any) {
		return $axios.post<any>('auth/login', data)
	},
	generateBannerToken(file: FormData) {
		return $axios.post<any>('users/banner/upload-token', file)
	},
	generateThumbnailToken(file: FormData) {
		return $axios.post<any>('users/thumbnail/upload-token', file)
	},
	getByUserId(userId: string) {
		return $axios.get<any>('users/nickname-check', { params: { userId } })
	},
	getSelfCreator(file: FormData) {
		return $axios.get<any>('creators/self')
	},
	checkNicknameAvailable(nickname: string) {
		return $axios.get<any>('users/nickname-check', { params: { nickname } })
	}
}