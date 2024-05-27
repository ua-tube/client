import { FC, PropsWithChildren, useState, useEffect } from 'react'
import { useScreenSize, useAuth } from '@/hooks'
import { useSidebarContext } from '@/providers'
import { TooltipProvider } from '@/components'
import DashboardSidebar from './sidebar'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const DashboardHeader = dynamic(() => import('./header'))

const SidebarProvider = dynamic(() => import('@/providers/SidebarProvider'))

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
	return (
		<div
			className={`pt-16 px-4 ${isOpen && !isScreenSmall && !openInDrawer ? 'sm:ml-48' : 'sm:ml-20'}`}
			children={children}
		/>
	)
}

const DashboardLayout: FC<
	IDashboardLayoutProps
> = ({
			 children,
			 openInDrawer
		 }) => {

	const { query, replace } = useRouter()
	const { user } = useAuth()
	const [showModal, setShowModal] = useState<boolean>(false)

	useEffect(() => {
		;(async () => !user && replace('/'))()
	}, [user])

	useEffect(() => {
		if (query.upload) setShowModal(Boolean(+(query.upload as string)))
	}, [query])

	return (
		<SidebarProvider>
			<TooltipProvider>
				<DashboardHeader />
				<DashboardSidebar />
				<DashboardLayoutContent {...{ children, openInDrawer }} />
				<VideoUploadModal {...{ setShowModal, showModal }} />
			</TooltipProvider>
		</SidebarProvider>
	)
}

export default DashboardLayout
