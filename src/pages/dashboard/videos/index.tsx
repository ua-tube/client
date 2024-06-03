import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const VideosTable = dynamic(
	() => import('@/components/dashboard/video/VideosTable'),
	{
		ssr: false
	}
)

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{
		ssr: false,
		loading: () => <DynamicIcon name='loader' className='loader-container' />
	}
)

const DashboardVideosPage: FC = () => {
	return (
		<>
			<AppHead title='Відео контент' />
			<DashboardLayout>
				<h2 className='text-3xl font-bold tracking-tight flex items-center py-4'>
					Контент каналу
				</h2>
				<VideosTable />
			</DashboardLayout>
		</>
	)
}

export default DashboardVideosPage
