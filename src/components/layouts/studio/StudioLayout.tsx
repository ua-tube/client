import { FC, PropsWithChildren, useEffect, useState } from 'react'
import { useAuth, useScreenSize } from '@/hooks'
import { useSidebarContext } from '@/providers'
import { TooltipProvider } from '@/components'
import { useRouter } from 'next/router'
import StudioSidebar from './sidebar'
import dynamic from 'next/dynamic'
import { VideoProcessingStatusType } from '@/interfaces'
import { toast } from 'sonner'
import { getVideoProcessingStatus } from '@/utils'
import { useTranslation } from 'next-i18next'

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
	const { t } = useTranslation('studio')

	const { query, replace } = useRouter()
	const { user, accessToken } = useAuth()

	useEffect(() => {
		const sse = new EventSource(
			`${process.env.GATEWAY_SERVER_URL}/video-manager/sse?token=${accessToken}`
		)

		sse.onmessage = ({ data }) => {
			const {
				data: { status, label, videoId },
				event
			} = JSON.parse(data) as {
				event:
					| 'video_status_changed'
					| 'thumbnail_processed'
					| 'video_step_processed'
				data: {
					videoId: string
					status: VideoProcessingStatusType
					label: string
				}
			}
			switch (event) {
				case 'thumbnail_processed':
					toast.success("Відео прев'ю згенеровані!", { duration: 2000 })
					break
				case 'video_status_changed':
					toast.success(
						`Статус відео змінено на ${getVideoProcessingStatus(status, t)}`,
						{ duration: 2000 }
					)
					break
				case 'video_step_processed':
					toast.success(`Оброблено якість - ${label}`, { duration: 2000 })
					break
			}
		}

		return () => {
			sse.close()
		}
	}, [])

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
