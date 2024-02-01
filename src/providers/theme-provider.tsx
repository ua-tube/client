import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'
import { FC } from 'react'

const ThemeProvider: FC<ThemeProviderProps> = ({ children, ...props }) => {
	return (
		<NextThemesProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
			{...props}
		>
			{children}
		</NextThemesProvider>
	)
}

export default ThemeProvider
