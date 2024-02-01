import { TailwindIndicator, TooltipProvider } from '@/components'
import { SidebarProvider } from '@/providers'
import { FC, PropsWithChildren } from 'react'
import HomeHeader from './home-header'
import { HomeSidebar } from './home-sidebar'

const HomeLayout: FC<PropsWithChildren> = ({ children }) => {
	return (
		<SidebarProvider>
			<TooltipProvider>
				<div className='max-h-screen flex flex-col bg-background'>
					<HomeHeader />
					<div className='grid grid-cols-[auto,1fr] flex-grow-1 overflow-x-hidden'>
						<HomeSidebar />
						<div className='overflow-x-hidden px-8 pb-4' children={children} />
					</div>
					<TailwindIndicator />
				</div>
			</TooltipProvider>
		</SidebarProvider>
	)
}

export default HomeLayout
