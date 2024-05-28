/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	transpilePackages: ['lucide-react'],
	swcMinify: false,
	i18n: {
		defaultLocale: 'uk',
		locales: ['uk', 'en'],
		localeDetection: false
	},
	env: {
		GATEWAY_SERVER_URL: process.env.GATEWAY_SERVER_URL,
		AUTH_SERVER_URL: process.env.AUTH_SERVER_URL,
		STORAGE_SERVER_URL: process.env.STORAGE_SERVER_URL,
		STORAGE_SERVER_API_URL: process.env.STORAGE_SERVER_API_URL,
		FRONTEND_URL: process.env.FRONTEND_URL
	},
	images: {
		domains: ['ua-tube.pp.ua', '192.168.2.100'],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: '192.168.2.100',
				port: '10000',
				pathname: '/images/**'
			}
		]
	}
}

export default nextConfig
