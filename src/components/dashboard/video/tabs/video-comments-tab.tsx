import { CategoryPills } from '@/components'
import { defaultComments } from '@/data'
import dynamic from 'next/dynamic'
import { FC } from 'react'


const DashboardCommentsList = dynamic(() => import('../../comments/dashboard-comments-list'))


const VideoEditTab: FC = () => {

	return (
		<div>
			<CategoryPills categories={['Не мають відповіді', 'Популярні']} />
			<DashboardCommentsList comments={defaultComments} disableComment />
		</div>
	)


}

export default VideoEditTab
