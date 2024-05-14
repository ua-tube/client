import { AppHead, DynamicIcon } from '@/components'
import { categories, videos } from '@/data'
import dynamic from 'next/dynamic'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)
const VideosList = dynamic(
	() => import('@/components/videos/general/VideosList')
)

export default function HomePage() {
	return (
		<>
			<AppHead title='Головна сторінка' />
			<HomeLayout autoShowSidebar>
				<CategoryPills categories={categories} />
				<VideosList videos={videos} />
			</HomeLayout>
		</>
	)
}
