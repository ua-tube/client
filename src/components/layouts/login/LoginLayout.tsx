import { FC, PropsWithChildren, useEffect } from 'react'
import { useAuth } from '@/hooks'
import { useRouter } from 'next/router'

interface ILoginLayoutProps extends PropsWithChildren {}

const LoginLayout: FC<ILoginLayoutProps> = ({ children }) => {
	const { user } = useAuth()
	const { replace } = useRouter()

	useEffect(() => {
		;(async () => user?.creator && replace('/dashboard/videos'))()
	}, [user])

	return <div className='loader-container'>{children}</div>
}

export default LoginLayout
