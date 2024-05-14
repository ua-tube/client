import { DynamicIcon, AppHead, DataTable } from '@/components'
import { videoColumns } from '@/data/tables'
import dynamic from 'next/dynamic'
import { videos } from '@/data'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

const DashboardVideosPage: FC = () => {
	return (
		<>
			<AppHead title='Відео контент' />
			<DashboardLayout>
				<h2 className='text-3xl font-bold tracking-tight flex items-center py-4'>
					Контент каналу
				</h2>
				<DataTable data={videos} columns={videoColumns} />
			</DashboardLayout>
		</>
	)
}

export default DashboardVideosPage
