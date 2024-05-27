import createAuthRefreshInterceptor, {
	AxiosAuthRefreshOptions
} from 'axios-auth-refresh'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { logOut, refreshAccessToken } from '@/store/auth/auth.actions'
import { $axiosFormData, $axios } from '@/api/axios'
import { useRouter } from 'next/router'
import { AuthService } from '@/services'

export const setupAxiosInterceptors = (store: any) => {
	const { locale } = useRouter()
	const { dispatch, getState } = store

	let accessToken = getState().auth.accessToken

	const isServer = typeof window === 'undefined'

	const onUnauthorized = () => dispatch(logOut())

	const onRefreshToken = async () => {
		const { data } = await AuthService.refreshAccessToken()
		accessToken = data.accessToken
		dispatch(refreshAccessToken(data.accessToken))
	}

	const axiosAuthConfig: AxiosAuthRefreshOptions = {
		statusCodes: [401, 409],
		pauseInstanceWhileRefreshing: true
	}

	const requestConfig = (config: InternalAxiosRequestConfig) => {
		if (!isServer && accessToken)
			config.headers['Authorization'] = `Bearer ${accessToken}`

		config.headers['x-lang'] = !isServer ? locale : 'uk'
		return config
	}

	const axiosRefreshCall = async (error: AxiosError) => {
		if (error.response?.status === 401) {
			await onRefreshToken()
			return $axios({
				...error.config,
				headers: {
					...error.config?.headers,
					Authorization: `Bearer ${accessToken}`
				}
			})
		} else if (error.response?.status === 409) onUnauthorized()
		throw error
	}

	createAuthRefreshInterceptor($axios, axiosRefreshCall, axiosAuthConfig)
	$axios.interceptors.request.use(requestConfig)

	createAuthRefreshInterceptor(
		$axiosFormData,
		axiosRefreshCall,
		axiosAuthConfig
	)
	$axiosFormData.interceptors.request.use(requestConfig)
}
