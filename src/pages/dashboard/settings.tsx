import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

const DashboardSettingsPage: FC = () => {
	return (
		<>
			<AppHead title='Налаштування' />
			<DashboardLayout></DashboardLayout>
		</>
	)
}

export default DashboardSettingsPage
