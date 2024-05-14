import { ICsrfTokenResponse } from '@/interfaces'
import { $axios } from '@/api/axios'

export const generateCsrfToken = async () =>
	$axios.get<ICsrfTokenResponse>('csrf/token')
