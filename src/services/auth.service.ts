import { $axios } from '@/api/axios'
import axios from 'axios'
import {
	IErrorResponse,
	ILoginRequest,
	ILoginResponse,
	IRecoveryPassRequest,
	IRefreshAccessTokenResponse,
	ISignUpRequest
} from '@/interfaces'

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
		return axios.get<IRefreshAccessTokenResponse>('auth/refresh', { baseURL })
	},

	async logout(accessToken?: string) {
		return $axios.get('auth/logout', {
			baseURL,
			...(accessToken
				? { headers: { Authorization: `Bearer ${accessToken}` } }
				: undefined)
		})
	}
}
