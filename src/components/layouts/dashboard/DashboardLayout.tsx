import { FC, PropsWithChildren, useState, useEffect } from 'react'
import DashboardHeader from './DashboardHeader'
import { TooltipProvider } from '@/components'
import DashboardSidebar from './sidebar'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

const SidebarProvider = dynamic(
	() => import('@/providers/sidebar-provider')
)
const TailwindIndicator = dynamic(
	() => import('@/components/TailwindIndicator')
)
const VideoUploadModal = dynamic(() => import('./videoUpload'))

const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
	const { query } = useRouter()
	const [showModal, setShowModal] = useState<boolean>(false)

	useEffect(() => {
		if (query.upload)
			setShowModal(Boolean(+(query.upload as string)))
	}, [query])


	return <SidebarProvider>
		<TooltipProvider>
			<div className="flex flex-col max-h-screen">
				<DashboardHeader />
				<div className="grid grid-cols-[auto,1fr] flex-grow-1">
					<DashboardSidebar />
					<div
						className="px-2 md:px-8 pb-4"
						children={children}
					/>
				</div>
				<VideoUploadModal {...{ setShowModal, showModal }} />
				<TailwindIndicator />
			</div>
		</TooltipProvider>
	</SidebarProvider>

}

export default DashboardLayout
