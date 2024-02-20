import { useState, useEffect } from 'react'

interface IScreenSize {
	width: number;
	height: number;
}

interface IUseScreenSize {
	screen: IScreenSize
	isScreenSmall: boolean
}

export const useScreenSize = (): IUseScreenSize => {
	const [screenSize, setScreenSize] = useState<IScreenSize>({
		width: 0,
		height: 0
	})

	useEffect(() => {
		const handleResize = () =>
			setScreenSize({
				width: window.innerWidth,
				height: window.innerHeight
			})

		handleResize()

		window.addEventListener('resize', handleResize)

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return { screen: screenSize, isScreenSmall: screenSize.width < 1024 }
}

