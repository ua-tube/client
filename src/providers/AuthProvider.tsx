import { NextShield, NextShieldProps } from 'next-shield'
import { FC, PropsWithChildren } from 'react'
import { DynamicIcon } from '@/components'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks'
import {
	hybridRoutes,
	privateRoutes,
	publicRoutes,
	userPrivateRoutes
} from '@/constants'

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const { user } = useAuth()
	const router = useRouter()
	const { query } = router

	const shieldConfig: NextShieldProps<
		typeof privateRoutes,
		typeof publicRoutes
	> = {
		router,
		isAuth: !!user,
		isLoading: false,
		LoadingComponent: (
			<DynamicIcon name='loader' className='loader-container' />
		),
		privateRoutes,
		publicRoutes,
		hybridRoutes,
		loginRoute: '/auth/login',
		RBAC: {
			USER: {
				grantedRoutes: userPrivateRoutes,
				accessRoute: (query?.returnUrl as string) || '/user/orders'
			},
			ADMIN: {
				grantedRoutes: privateRoutes,
				accessRoute: (query?.returnUrl as string) || '/admin/products'
			}
		},
		userRole: user?.role
	}

	return <NextShield {...shieldConfig}>{children}</NextShield>
}
export default AuthProvider
