import { ILoginData, ISignUpData } from '@/store/auth/auth.interface'
import { IErrorResponse } from '@/interfaces'
import { $axios } from '@/api/axios'

const AUTH_API = process.env.AUTH_SERVER_URL || ''

export const AuthService = {
	async login(loginBody: ILoginData) {
		return $axios.post<any>('auth/login', loginBody, {
			baseURL: AUTH_API
		})
	},

	async signup(signupData: ISignUpData) {
		return $axios.post<any>('auth/signup', signupData, {
			baseURL: AUTH_API
		})
	},

	async recoveryPass(data: { email: string }) {
		return $axios.post<IErrorResponse>('auth/recovery', data, {
			baseURL: AUTH_API
		})
	},

	async passReset(data: any) {
		return $axios.post<IErrorResponse>('auth/recovery/reset-password', data, {
			baseURL: AUTH_API
		})
	},

	async logout() {
		return $axios.get('auth/logout', {
			baseURL: AUTH_API
		})
	}
}
