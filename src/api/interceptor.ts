import { $axios, $axiosFormData } from '@/api/axios'
import { logOut, refreshAccessToken } from '@/store/auth/auth.actions'
import { IErrorResponse } from '@/interfaces'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import createAuthRefreshInterceptor, { AxiosAuthRefreshOptions } from 'axios-auth-refresh'

export const setupAxiosInterceptors = (store: any) => {
	const { locale } = useRouter()
	const { dispatch } = store

	const isServer = typeof window === 'undefined'

	const onUnauthorized = () => dispatch(logOut())

	const onRefreshToken = () => dispatch(refreshAccessToken())

	const axiosAuthConfig: AxiosAuthRefreshOptions = {
		statusCodes: [401],
		pauseInstanceWhileRefreshing: true
	}

	const requestConfig = (config: any) => {
		// if (!isServer && store.auth.accessToken)
		// 	config.headers['Authorization'] = store.auth.accessToken
		// if (!isServer)
		// 	config.headers['X-XSRF-TOKEN'] = sessionStorage.getItem('csrf-token')

		config.headers['x-lang'] = !isServer ? locale : 'uk'
		return config
	}

	const axiosRefreshCall = async (error: AxiosError<IErrorResponse>) => {
		if (error.response?.status === 401) {
			onRefreshToken()
			onUnauthorized()
		}
		throw error
	}

	createAuthRefreshInterceptor($axios, axiosRefreshCall, axiosAuthConfig)

	createAuthRefreshInterceptor(
		$axiosFormData,
		axiosRefreshCall,
		axiosAuthConfig
	)

	$axiosFormData.interceptors.request.use(requestConfig)

	$axios.interceptors.request.use(requestConfig)
}
