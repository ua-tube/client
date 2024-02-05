import { createContext, FC, PropsWithChildren, useContext, useState } from 'react'
import { TooltipProvider } from '@/components'
import HomeHeader from './home-header'
import { HomeSidebar } from './sidebar'
import dynamic from 'next/dynamic'

const TailwindIndicator = dynamic(
	() => import('@/components/tailwind-indicator')
)

interface IHomeLayoutProps {
	autoHideSidebar?: boolean
	hiddenSidebar?: boolean
}

interface ISidebarContext {
	isLargeOpen: boolean
	isSmallOpen: boolean
	toggle: () => void
	close: () => void
}

const SidebarContext = createContext<ISidebarContext | null>(null)

export function useSidebarContext() {
	const value = useContext(SidebarContext)
	if (value == null) throw Error('Cannot use outside of SidebarProvider')
	return value
}

export const SidebarProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isLargeOpen, setIsLargeOpen] = useState(true)
	const [isSmallOpen, setIsSmallOpen] = useState(false)

	const isScreenSmall = () => window.innerWidth < 1024

	const toggle = () =>
		isScreenSmall() ? setIsSmallOpen(s => !s) : setIsLargeOpen(l => !l)

	const close = () =>
		isScreenSmall() ? setIsSmallOpen(false) : setIsLargeOpen(false)

	return (
		<SidebarContext.Provider
			value={{ isLargeOpen, isSmallOpen, toggle, close }}
			children={children}
		/>
	)
}

const HomeLayout: FC<PropsWithChildren<IHomeLayoutProps>> = ({
																															 children,
																															 autoHideSidebar,
																															 hiddenSidebar
																														 }) => {
	return (
		<SidebarProvider>
			<div className="max-h-screen flex flex-col bg-background">
				<TooltipProvider>
					<HomeHeader />
				</TooltipProvider>
				<div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-x-hidden">
					<HomeSidebar {...{ autoHideSidebar, hiddenSidebar }} />
					<div className="overflow-x-hidden px-8 pb-4" children={children} />
				</div>
				<TailwindIndicator />
			</div>
		</SidebarProvider>
	)
}

export default HomeLayout
