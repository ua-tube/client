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
		SSR_URL: process.env.SSR_URL
	},
	images: { domains: ['localhost', 'ua-tube.com.ua'] }
}

export default nextConfig
