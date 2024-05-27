import {
	IErrorResponse,
	ILoginResponse,
	IRefreshAccessTokenResponse,
	ILoginRequest,
	ISignUpRequest,
	IRecoveryPassRequest
} from '@/interfaces'
import { $axios } from '@/api/axios'

const baseURL = process.env.AUTH_SERVER_URL

export const AuthService = {
	async login(loginBody: ILoginRequest) {
		return $axios.post<ILoginResponse>('auth/login', loginBody, { baseURL })
	},

	async signup(signupData: ISignUpRequest) {
		return $axios.post<ILoginResponse>('auth/signup', signupData, { baseURL })
	},

	async recoveryPass(data: IRecoveryPassRequest) {
		return $axios.post<IErrorResponse>('auth/recovery/create-token', data, {
			baseURL
		})
	},

	async passReset(data: any) {
		return $axios.post<IErrorResponse>('auth/recovery/reset-password', data, {
			baseURL
		})
	},

	async refreshAccessToken() {
		return $axios.get<IRefreshAccessTokenResponse>('auth/refresh', { baseURL })
	},

	async logout() {
		return $axios.get('auth/logout', { baseURL })
	}
}
