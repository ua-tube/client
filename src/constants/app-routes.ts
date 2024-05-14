const userPrivateRoutes = [
	'/dashboard/analytics',
	'/dashboard/comments',
	'/dashboard/complaints',
	'/dashboard/index',
	'/dashboard/personalization',
	'/dashboard/settings',
	'/dashboard/videos/[videoId]',
	'/dashboard/videos/index',
	'/subscriptions',
	'/history'
]

const privateRoutes = ['/admin/reports']

const authRoutes = [
	'/auth/index',
	'/auth/sign-in',
	'/auth/sign-up',
	'/auth/recovery'
]

const publicRoutes = ['/', ...authRoutes]

const dynamicRoutes = ['/watch', '/search', '/playlist', '/channel/[nickName]']

const hybridRoutes = ['/404', ...dynamicRoutes, ...publicRoutes]

export { hybridRoutes, userPrivateRoutes, privateRoutes, publicRoutes }
