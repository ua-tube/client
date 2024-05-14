import { FC, PropsWithChildren, useEffect } from 'react'
import { generateCsrfToken } from '@/utils'
import { useRouter } from 'next/router'

const CSRFProvider: FC<PropsWithChildren> = ({ children }) => {
	const { pathname } = useRouter()
	useEffect(() => {
		if (pathname !== '/404')
			generateCsrfToken().then(({ data }) =>
				sessionStorage.setItem('csrf-token', data.data.token)
			)
	}, [])
	return children
}

export default CSRFProvider
