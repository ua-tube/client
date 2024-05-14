import { PersistGate } from 'redux-persist/integration/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ThemeProvider } from '@/providers'
import { persistor, store } from '@/store'
import type { AppType } from 'next/app'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import dynamic from 'next/dynamic'

import '@/styles/globals.css'


const AppToaster = dynamic(() => import('@/providers/AppToaster'), {
	ssr: false
})

const MyApp: AppType = ({ Component, pageProps }) => {
	const { pathname } = useRouter()
	return (
		<AnimatePresence mode='wait'>
			<motion.div key={pathname}>
				<Provider store={store}>
					<PersistGate persistor={persistor}>
						{() => (
							// <CSRFProvider>
							<ThemeProvider>
								<Component {...pageProps} />
								<AppToaster />
							</ThemeProvider>
							// </CSRFProvider>
						)}
					</PersistGate>
				</Provider>
				<motion.div
					className='slide-in'
					initial={{ scaleY: 0 }}
					animate={{ scaleY: 0 }}
					exit={{ scaleY: 1 }}
					transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
				/>
				<motion.div
					className='slide-out'
					initial={{ scaleY: 1 }}
					animate={{ scaleY: 0 }}
					exit={{ scaleY: 0 }}
					transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
				/>
			</motion.div>
		</AnimatePresence>
	)
}

export default MyApp
