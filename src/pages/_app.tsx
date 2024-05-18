import { PersistGate } from 'redux-persist/integration/react'
import { setupAxiosInterceptors } from '@/api/interceptor'
import { ThemeProvider } from '@/providers'
import { persistor, store } from '@/store'
import type { AppType } from 'next/app'
import { Provider } from 'react-redux'
import dynamic from 'next/dynamic'

import '@/styles/globals.css'


const AppToaster = dynamic(() => import('@/providers/AppToaster'), {
	ssr: false
})

const MyApp: AppType = ({ Component, pageProps }) => {

	setupAxiosInterceptors(store)

	return (
		<Provider store={store}>
			<PersistGate persistor={persistor}>
				{() => (
					<ThemeProvider>
						<Component {...pageProps} />
						<AppToaster />
					</ThemeProvider>
				)}
			</PersistGate>
		</Provider>
	)
}

export default MyApp
