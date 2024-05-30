import { $axiosFormData } from '@/api/axios'
import { IStorageResponse } from '@/interfaces'
import { AxiosProgressEvent } from 'axios'

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
	async uploadVideo(
		videoData: FormData,
		token: string,
		accessToken?: string,
		onUploadProgress?: (p: AxiosProgressEvent) => void
	) {
		return $axiosFormData.post<IStorageResponse>('storage/videos', videoData, {
			baseURL,
			params: { token },
			onUploadProgress,
			...(accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined)
		})
	}
}
