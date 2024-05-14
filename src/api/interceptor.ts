import { $axios, $axiosFormData } from '@/api/axios'
import { logOut } from '@/store/auth/auth.actions'
import { IErrorResponse } from '@/interfaces'
import { generateCsrfToken } from '@/utils'
import { useRouter } from 'next/router'
import { AxiosError } from 'axios'
import createAuthRefreshInterceptor, {
	AxiosAuthRefreshOptions
} from 'axios-auth-refresh'

export const setupAxiosInterceptors = (store: any) => {
	const { locale, replace } = useRouter()
	const { dispatch } = store

	const isServer = typeof window === 'undefined'

	const onUnauthorized = () => dispatch(logOut())

	const axiosAuthConfig: AxiosAuthRefreshOptions = {
		statusCodes: [401, 403, 502],
		pauseInstanceWhileRefreshing: true
	}

	const requestConfig = (config: any) => {
		if (!isServer)
			config.headers['X-XSRF-TOKEN'] = sessionStorage.getItem('csrf-token')
		config.headers['x-lang'] = !isServer ? locale : 'uk'
		return config
	}

	const axiosRefreshCall = async (error: AxiosError<IErrorResponse>) => {
		if (error.response?.status === 401) {
			switch (error.response?.data?.code) {
				case 1:
				case 5:
				case 6:
				case 7:
				case 16:
				case 18:
					onUnauthorized()
					break
				case 2:
					try {
						await $axios.get<IErrorResponse>('auth/refresh')
						return await Promise.resolve()
					} catch {
						onUnauthorized()
						return await Promise.reject()
					}
			}
		} else if (error.response?.status === 403) {
			switch (error.response?.data?.code) {
				case 3:
					!isServer &&
						replace(
							`/403?error=403&message=${encodeURIComponent(
								'Немає прав доступу до ресурсу!'
							)}`
						)
					break
				case 4:
					onUnauthorized()
					break
				case 8:
				case 9:
					try {
						const { data } = await generateCsrfToken()
						sessionStorage.setItem('csrf-token', data.data.token)
						return Promise.resolve()
					} catch {
						throw error
					}
			}
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
