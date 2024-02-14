import { ThemeProvider } from '../providers'
import type { AppType } from 'next/app'

import '@/styles/globals.css'
import dynamic from 'next/dynamic'

const NextNProgress = dynamic(() => import('nextjs-progressbar'), {
	ssr: false
})

const MyApp: AppType = ({ Component, pageProps }) => {
	return (
		<ThemeProvider>
			<NextNProgress
				color='white'
				options={{ showSpinner: false, minimum: 0.2 }}
				stopDelayMs={200}
				height={3}
			/>
			<Component {...pageProps} />
		</ThemeProvider>
	)
}

export default MyApp
