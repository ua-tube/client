import { DynamicIcon, AppHead } from '@/components'
import { videoEditColumns } from '@/components/dashboard/video/VideoEditColumns'
import dynamic from 'next/dynamic'
import { FC, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { IDashboardVideosResponse } from '@/interfaces'
import { VideoManagerService } from '@/services'

const DataTable = dynamic(() => import('@/components/dataTable/DataTable'), {
	ssr: false
})

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{
		ssr: false,
		loading: () => <DynamicIcon name="loader" className="loader-container" />
	}
)

const DashboardVideosPage: FC = () => {
	const { query } = useRouter()
	const [videosData, setVideosData] = useState<IDashboardVideosResponse>({
		videos: [],
		count: 0
	})

	useEffect(() => {
		;(async () => {
			const { data } = await VideoManagerService.getVideos(
				{
					page: (query?.page as string | undefined) || '1',
					perPage: (query?.perPage as string | undefined) || '20'
				}
			)
			setVideosData(data)
		})()
	}, [query])

	return (
		<>
			<AppHead title="Відео контент" />
			<DashboardLayout>
				<h2 className="text-3xl font-bold tracking-tight flex items-center py-4">
					Контент каналу
				</h2>
				<DataTable data={videosData.videos} columns={videoEditColumns as any} />
			</DashboardLayout>
		</>
	)
}

export default DashboardVideosPage
