import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const DashboardLastSubscriptionsCard = dynamic(() => import('@/components/dashboard/main/lastSubsCard'))
const DashboardLastVideoCard = dynamic(() => import('@/components/dashboard/main/lastVideoCard'))
const DashboardAnalyticsCard = dynamic(() => import('@/components/dashboard/main/analyticsCard'))
const DashboardLastVideosCard = dynamic(() => import('@/components/dashboard/main/lastVideosCard'))
const DashboardLastCommentsCard = dynamic(() => import('@/components/dashboard/main/lastCommentsCard'))

const DashboardPage: FC = () => {
	return <>
		<AppHead title="Творча студія" />
		<DashboardLayout>
			<div className="masonry md:masonry-sm xl:masonry-md 3xl:masonry-lg my-8 max-w-fit">
				<DashboardLastSubscriptionsCard />
				<DashboardLastVideoCard />
				<DashboardAnalyticsCard />
				<DashboardLastVideosCard />
				<DashboardLastCommentsCard />
			</div>
		</DashboardLayout>
	</>

}

export default DashboardPage
