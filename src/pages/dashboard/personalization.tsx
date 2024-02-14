import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const ChannelPersonalizationPage: FC = () => {

	return <>
		<AppHead title="Персоналізація каналу" />
		<DashboardLayout>

		</DashboardLayout>
	</>

}

export default ChannelPersonalizationPage
