import { AppHead, VideosList } from '@/components'
import { HomeLayout } from '@/components/layouts'
import { videos } from '@/data'


export default function VideoPage() {
	return (
		<>
			<AppHead title="Підписки" />
			<HomeLayout>
				<section className="mx-auto">
					<VideosList title='Нові відео' videos={videos} />
				</section>
			</HomeLayout>
		</>
	)
}