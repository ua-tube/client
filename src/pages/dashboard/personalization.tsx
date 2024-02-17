import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const DashboardPersonalizationTabs = dynamic(
	() => import('@/components/dashboard/personalization/personalization-tabs'))

const ChannelPersonalizationPage: FC = () => {

	return <>
		<AppHead title="Персоналізація каналу" />
		<DashboardLayout>
			<h2 className="text-3xl font-bold tracking-tight flex items-center py-4">
				Персоналізація каналу
			</h2>
			<DashboardPersonalizationTabs/>
		</DashboardLayout>
	</>

}

export default ChannelPersonalizationPage
