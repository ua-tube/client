module.exports = {
	i18n: {
		defaultLocale: 'uk',
		locales: ['uk', 'fr', 'de', 'tr', 'pl', 'es', 'it', 'en'],
		localeDetection: false
	},
	reloadOnPrerender: process.env.NODE_ENV === 'development'
}