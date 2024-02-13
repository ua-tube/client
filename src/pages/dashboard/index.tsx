import { FC } from 'react'
import {
	DashboardLayout,
	DashboardAnalyticsCard,
	DashboardLastVideosCard,
	DashboardLastVideoCard,
	DashboardLastSubscriptionsCard,
	DashboardLastCommentsCard
} from '@/components'

const DashboardPage: FC = () => {

	return <DashboardLayout>
		<div className='masonry sm:masonry-sm md:masonry-md 2xl:masonry-lg my-8'>
			<DashboardLastSubscriptionsCard />
			<DashboardAnalyticsCard />
			<DashboardLastVideosCard />
			<DashboardLastVideoCard />
			<DashboardLastCommentsCard />
		</div>
	</DashboardLayout>

}

export default DashboardPage
