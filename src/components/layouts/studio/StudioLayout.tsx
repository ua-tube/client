import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useScreenSize } from '@/hooks'
import { useSidebarContext } from '@/providers'
import { TooltipProvider } from '@/components'
import StudioSidebar from './sidebar'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const StudioHeader = dynamic(() => import('./header/StudioHeader'))

const SidebarProvider = dynamic(() => import('@/providers/SidebarProvider'))

const VideoCreateModal = dynamic(() => import('./videosModal/VideoCreateModal'))

interface IStudioLayoutProps extends PropsWithChildren {
	openInDrawer?: boolean
}

const StudioLayoutContent: FC<IStudioLayoutProps> = ({
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

const StudioLayout: FC<IStudioLayoutProps> = ({ children, openInDrawer }) => {
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
				<StudioHeader setUploadModalShow={setShowModal} />
				<StudioSidebar />
				<StudioLayoutContent {...{ children, openInDrawer }} />
				<VideoCreateModal {...{ setShowModal, showModal }} />
			</TooltipProvider>
		</SidebarProvider>
	)
}

export default StudioLayout
