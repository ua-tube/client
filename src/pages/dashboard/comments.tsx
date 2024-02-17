import { DynamicIcon, AppHead, CategoryPills, DashboardCommentsList } from '@/components'
import { defaultComments } from '@/data'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)


const ChannelCommentsPage: FC = () => {

	return <>
		<AppHead title="Коментарі" />
		<DashboardLayout>
			<h2 className="text-3xl font-bold tracking-tight flex items-center py-4">
				Коментарі
			</h2>
			<CategoryPills categories={['Опубліковані', 'Очікують на розгляд', 'Заблоковані', 'Не мають відповіді']} />
			<DashboardCommentsList comments={defaultComments} />
		</DashboardLayout>
	</>

}

export default ChannelCommentsPage
