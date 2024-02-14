import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const DashboardLastSubscriptionsCard = dynamic(() => import('@/components/dashboard/main/last-subs-card'))
const DashboardLastVideoCard = dynamic(() => import('@/components/dashboard/main/last-video-card'))
const DashboardAnalyticsCard = dynamic(() => import('@/components/dashboard/main/analytics-card'))
const DashboardLastVideosCard = dynamic(() => import('@/components/dashboard/main/last-videos-card'))
const DashboardLastCommentsCard = dynamic(() => import('@/components/dashboard/main/last-comments-card'))

const DashboardPage: FC = () => {
	return <>
		<AppHead title="Творча студія" />
		<DashboardLayout>
			<div className="masonry sm:masonry-sm md:masonry-md 3xl:masonry-lg my-8 max-w-fit">
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
