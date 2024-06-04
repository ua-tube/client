import { FC, PropsWithChildren, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks'

interface ILoginLayoutProps extends PropsWithChildren {}

const LoginLayout: FC<ILoginLayoutProps> = ({ children }) => {
	const { user } = useAuth()
	const { replace } = useRouter()

	useEffect(() => {
		;(async () => user?.creator && replace('/studio/videos'))()
	}, [user])

	return <div className='loader-container'>{children}</div>
}

export default LoginLayout
