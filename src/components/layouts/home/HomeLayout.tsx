import { useSidebarContext } from '@/providers'
import { FC, PropsWithChildren } from 'react'
import { HomeSidebar } from './sidebar'
import { useScreenSize } from '@/hooks'
import dynamic from 'next/dynamic'
import { cn } from '@/utils'

const SidebarProvider = dynamic(() => import('@/providers/SidebarProvider'), {
	ssr: false
})

const HomeHeader = dynamic(() => import('./header'))

interface IHomeLayoutProps {
	autoShowSidebar?: boolean
	openInDrawer?: boolean
}

const HomeLayoutContent: FC<
	PropsWithChildren<Omit<IHomeLayoutProps, 'autoShowSidebar'>>
> = ({ children, openInDrawer }) => {
	const { isScreenSmall } = useScreenSize()
	const { isOpen } = useSidebarContext()
	return (
		<main
			className={cn(
				'pt-14',
				isOpen && !isScreenSmall && !openInDrawer && ' sm:ml-56'
			)}
		>
			{children}
		</main>
	)
}

const HomeLayout: FC<PropsWithChildren<IHomeLayoutProps>> = ({
	children,
	autoShowSidebar,
	openInDrawer
}) => {
	return (
		<SidebarProvider>
			<HomeHeader />
			<HomeSidebar {...{ autoShowSidebar, openInDrawer }} />
			<HomeLayoutContent {...{  children, openInDrawer }} />
		</SidebarProvider>
	)
}

export default HomeLayout
