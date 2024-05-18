/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	transpilePackages: ['lucide-react'],
	i18n: {
		defaultLocale: 'uk',
		locales: ['uk', 'en'],
		localeDetection: false
	},
	env: {
		SERVER_URL: process.env.SERVER_URL,
		AUTH_SERVER_URL: process.env.AUTH_SERVER_URL
	},
	images: { domains: ['localhost', 'ua-tube.pp.ua'] }
}

export default nextConfig
