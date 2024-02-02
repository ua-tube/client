import { TooltipProvider } from '@/components'
import { SidebarProvider } from '@/providers'
import dynamic from 'next/dynamic'
import { FC, PropsWithChildren } from 'react'
import HomeHeader from './home-header'
import { HomeSidebar } from './home-sidebar'

const TailwindIndicator = dynamic(
	() => import('@/components/tailwind-indicator')
)

interface IHomeLayoutProps {
	autoHideSidebar?: boolean
	hiddenSidebar?: boolean
}

const HomeLayout: FC<PropsWithChildren<IHomeLayoutProps>> = ({
	children,
	autoHideSidebar,
	hiddenSidebar
}) => {
	return (
		<SidebarProvider>
			<TooltipProvider>
				<div className='max-h-screen flex flex-col bg-background'>
					<HomeHeader />
					<div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-x-hidden'>
						<HomeSidebar {...{ autoHideSidebar, hiddenSidebar }} />
						<div className='overflow-x-hidden px-8 pb-4' children={children} />
					</div>
					<TailwindIndicator />
				</div>
			</TooltipProvider>
		</SidebarProvider>
	)
}

export default HomeLayout
