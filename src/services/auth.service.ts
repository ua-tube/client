import { ILoginData, ISignUpData } from '@/store/auth/auth.interface'
import { IErrorResponse } from '@/interfaces'
import { $axios } from '@/api/axios'

const baseURL = process.env.AUTH_SERVER_URL || process.env.SERVER_URL

export const AuthService = {
	async login(loginBody: ILoginData) {
		return $axios.post<any>('auth/login', loginBody, { baseURL })
	},

	async signup(signupData: ISignUpData) {
		return $axios.post<any>('auth/signup', signupData, { baseURL })
	},

	async recoveryPass(data: { email: string }) {
		return $axios.post<IErrorResponse>('auth/recovery', data, { baseURL })
	},

	async passReset(data: any) {
		return $axios.post<IErrorResponse>('auth/recovery/reset-password', data, {
			baseURL
		})
	},

	async refreshAccessToken() {
		return $axios.get<IErrorResponse>('auth/refresh', { baseURL })
	},

	async logout() {
		return $axios.get('auth/logout', { baseURL })
	}
}
