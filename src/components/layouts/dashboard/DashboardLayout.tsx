import { FC, PropsWithChildren, useState, useEffect } from 'react'
import { useSidebarContext } from '@/providers'
import { TooltipProvider } from '@/components'
import DashboardSidebar from './sidebar'
import { useScreenSize } from '@/hooks'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { cn } from '@/utils'

const DashboardHeader = dynamic(() => import('./header'))

const SidebarProvider = dynamic(
	() => import('@/providers/SidebarProvider')
)
const TailwindIndicator = dynamic(
	() => import('@/components/TailwindIndicator')
)
const VideoUploadModal = dynamic(() => import('./videoUpload'))

interface IDashboardLayoutProps extends PropsWithChildren {
	openInDrawer?: boolean
}

const DashboardLayoutContent: FC<
	IDashboardLayoutProps
> = ({
			 children,
			 openInDrawer
		 }) => {
	const { isScreenSmall } = useScreenSize()
	const { isOpen } = useSidebarContext()
	return <div
		className={cn(
			'mt-14 p-4',
			isOpen && !isScreenSmall && !openInDrawer && ' sm:ml-52',
			!isOpen && !isScreenSmall && !openInDrawer && ' sm:ml-20'
		)}
		children={children}
	/>
}


const DashboardLayout: FC<IDashboardLayoutProps> = ({ children, openInDrawer }) => {
	const { query } = useRouter()
	const [showModal, setShowModal] = useState<boolean>(false)

	useEffect(() => {
		if (query.upload)
			setShowModal(Boolean(+(query.upload as string)))
	}, [query])


	return <SidebarProvider>
		<TooltipProvider>
			<DashboardHeader />
			<DashboardSidebar />
			<DashboardLayoutContent {...{ children, openInDrawer }} />
			<VideoUploadModal {...{ setShowModal, showModal }} />
			<TailwindIndicator />
		</TooltipProvider>
	</SidebarProvider>

}

export default DashboardLayout
