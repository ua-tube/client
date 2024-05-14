import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

const ChannelComplaintsPage: FC = () => {
	return (
		<>
			<AppHead title='Скарги на канал' />
			<DashboardLayout></DashboardLayout>
		</>
	)
}

export default ChannelComplaintsPage
