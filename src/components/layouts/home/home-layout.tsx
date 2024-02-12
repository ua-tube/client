import { FC, PropsWithChildren } from 'react'
import { HomeSidebar } from './sidebar'
import HomeHeader from './home-header'
import dynamic from 'next/dynamic'

const SidebarProvider = dynamic(() => import('@/providers/sidebar-provider'), { ssr: false })

const TailwindIndicator = dynamic(
	() => import('@/components/tailwind-indicator')
)

interface IHomeLayoutProps {
	autoShowSidebar?: boolean
	hiddenSidebar?: boolean
	disableBasePadding?: boolean
}

const HomeLayout: FC<
	PropsWithChildren<
		IHomeLayoutProps
	>> = ({
					children,
					autoShowSidebar,
					hiddenSidebar,
					disableBasePadding
				}) => {
	return (
		<SidebarProvider>
			<div className="max-h-screen flex flex-col">
				<HomeHeader />
				<div className="lg:grid lg:grid-cols-[auto,1fr] flex-grow-1 overflow-x-hidden bg-background">
					<HomeSidebar {...{ autoShowSidebar, hiddenSidebar }} />
					<div
						className={`overflow-x-hidden ${!disableBasePadding && ' px-8 pb-4'}`}
						children={children}
					/>
				</div>
				<TailwindIndicator />
			</div>
		</SidebarProvider>
	)
}

export default HomeLayout
