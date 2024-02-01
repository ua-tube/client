import { AppHead, CategoryPills, VideosList } from '@/components'
import { HomeLayout } from '@/components/layouts'
import { videos } from '@/data'

export default function Home() {
	return (
		<>
			<AppHead title='Головна сторінка' />
			<HomeLayout>
				<CategoryPills />
				<VideosList videos={videos} />
			</HomeLayout>
		</>
	)
}
