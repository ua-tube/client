import { useSidebarContext } from '@/providers'
import { FC, PropsWithChildren } from 'react'
import { HomeSidebar } from './sidebar'
import { useScreenSize } from '@/hooks'
import dynamic from 'next/dynamic'
import { cn } from '@/utils'

const SidebarProvider = dynamic(() => import('@/providers/SidebarProvider'), { ssr: false })

const TailwindIndicator = dynamic(() => import('@/components/TailwindIndicator'))

const HomeHeader = dynamic(() => import('./header'))

interface IHomeLayoutProps {
	autoShowSidebar?: boolean
	openInDrawer?: boolean
	disableBasePadding?: boolean
}

const HomeLayoutContent: FC<
	PropsWithChildren<
		Omit<IHomeLayoutProps,
			'autoShowSidebar'
		>>> = ({
						 children,
						 disableBasePadding,
						 openInDrawer
					 }) => {
	const { isScreenSmall } = useScreenSize()
	const { isOpen } = useSidebarContext()
	return <div
		className={cn(
			'mt-14',
			!disableBasePadding && ' p-4',
			isOpen && !isScreenSmall && !openInDrawer && ' sm:ml-56'
		)}
		children={children}
	/>
}


const HomeLayout: FC<
	PropsWithChildren<
		IHomeLayoutProps
	>> = ({
					children,
					autoShowSidebar,
					disableBasePadding,
					openInDrawer
				}) => {

	return (
		<SidebarProvider>
			<HomeHeader />
			<HomeSidebar {...{ autoShowSidebar, openInDrawer }} />
			<HomeLayoutContent {...{ disableBasePadding, children, openInDrawer }} />
			<TailwindIndicator />
		</SidebarProvider>
	)
}

export default HomeLayout
