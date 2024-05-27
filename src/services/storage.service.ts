import { $axiosFormData } from '@/api/axios'
import { IStorageResponse } from '@/interfaces'

const baseURL = process.env.STORAGE_SERVER_API_URL

export const StorageService = {
	async uploadImage(
		data: FormData,
		token: string,
		accessToken: string
	): Promise<any> {
		return $axiosFormData.post<IStorageResponse>('storage/images', data, {
			baseURL,
			params: { token },
			headers: { Authorization: `Bearer ${accessToken}` }
		})
	},
	async uploadVideo(videoData: FormData, token: string, accessToken?: string) {
		return $axiosFormData.post<IStorageResponse>('storage/videos', videoData, {
			baseURL,
			params: { token },
			...(accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined)
		})
	}
}
