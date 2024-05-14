import { IErrorResponse, IUser } from '@/interfaces'
import { $axios } from '@/api/axios'

export const UserService = {
	async createUser(data: Partial<IUser>) {
		return $axios.post<any>('admin/create-user', data)
	},
	async passwordChange(data: any) {
		return $axios.post<IErrorResponse>(`users/update-password`, data)
	}
}
