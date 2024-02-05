import { appWithTranslation } from 'next-i18next'
import { ThemeProvider } from '../providers'
import type { AppType } from 'next/app'

import '@/styles/globals.css'

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default appWithTranslation(MyApp)
