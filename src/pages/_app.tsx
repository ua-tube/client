import { appWithTranslation } from 'next-i18next'
import type { AppType } from 'next/app'
import { ThemeProvider } from '../providers'

import '@/styles/globals.css'

const App: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default appWithTranslation(App)
