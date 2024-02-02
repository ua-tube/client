import { AppHead } from '@/components'
import { HomeLayout } from '@/components/layouts'
import { VideoPlayer } from '@/components/videos'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'

export const getServerSideProps: GetServerSideProps<{
	videoId: string
}> = async ({ query }) => {
	return { props: { videoId: (query?.videoId as string) || '' } }
}

export default function ShopPage({
	videoId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Перегляд відео ${videoId}`} />
			<HomeLayout hiddenSidebar autoHideSidebar>
				<section className='container mx-auto max-w-6xl flex flex-row'>
					<div className='w-2/3'>
						<VideoPlayer />
					</div>
					<div className='w-1/3'></div>
				</section>
			</HomeLayout>
		</>
	)
}
