import DashboardHeader from './dashboard-header'
import { TooltipProvider } from '@/components'
import { FC, PropsWithChildren } from 'react'
import DashboardSidebar from './sidebar'
import dynamic from 'next/dynamic'

const SidebarProvider = dynamic(() => import('@/providers/sidebar-provider'))
const TailwindIndicator = dynamic(() => import('@/components/tailwind-indicator'))

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
	return <SidebarProvider>
		<TooltipProvider>
			<div className="max-h-screen h-screen flex flex-col">
				<DashboardHeader />
				<div className="grid grid-cols-[auto,1fr] flex-grow-1">
					<DashboardSidebar />
					<div
						className="px-8 pb-4 overflow-x-hidden"
						children={children}
					/>
				</div>
				<TailwindIndicator />
			</div>
		</TooltipProvider>
	</SidebarProvider>

}

export default DashboardLayout
