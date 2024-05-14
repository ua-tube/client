import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

const DashboardAnalyticsPage: FC = () => {
	return (
		<>
			<AppHead title='Аналітика каналу' />
			<DashboardLayout></DashboardLayout>
		</>
	)
}

export default DashboardAnalyticsPage
