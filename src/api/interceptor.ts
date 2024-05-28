import { logOut, refreshAccessToken } from '@/store/auth/auth.actions'
import { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { $axios, $axiosFormData } from '@/api/axios'
import { IErrorResponse } from '@/interfaces'
import { AuthService } from '@/services'
import { useRouter } from 'next/router'
import createAuthRefreshInterceptor, {
	AxiosAuthRefreshOptions
} from 'axios-auth-refresh'

export const setupAxiosInterceptors = (store: any) => {
	const { locale } = useRouter()
	const { dispatch, getState } = store

	const isServer = typeof window === 'undefined'

	const onUnauthorized = () => {
		if (!getState().auth.accessToken) dispatch(logOut())
	}

	const onRefreshToken = async () => {
		const { data } = await AuthService.refreshAccessToken()
		dispatch(refreshAccessToken(data.accessToken))
	}

	const axiosAuthConfig: AxiosAuthRefreshOptions = {
		statusCodes: [401],
		pauseInstanceWhileRefreshing: true
	}

	const requestConfig = (config: InternalAxiosRequestConfig) => {
		if (!isServer && getState().auth.accessToken)
			config.headers['Authorization'] = `Bearer ${getState().auth.accessToken}`

		config.headers['x-lang'] = !isServer ? locale : 'uk'
		return config
	}

	const axiosRefreshCall = async (error: AxiosError<IErrorResponse>) => {

		if (error.response?.status === 401) {
			switch (error.response.data?.code) {
				case 3:
					await onRefreshToken()
					return await $axios({
						...error.config,
						headers: {
							...error.config?.headers,
							Authorization: `Bearer ${getState().auth.accessToken}`
						}
					})
				case 0:
				case 1:
				case 2:
				case 4:
					onUnauthorized()
					break
			}
		}

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
