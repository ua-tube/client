import { AppHead, CategoryPills, VideosList } from '@/components'
import { HomeLayout } from '@/components/layouts'
import { categories, videos } from '@/data'

export default function HomePage() {
	return (
		<>
			<AppHead title='Головна сторінка' />
			<HomeLayout>
				<CategoryPills categories={categories} />
				<VideosList videos={videos} />
			</HomeLayout>
		</>
	)
}
