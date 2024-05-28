import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'
import { IHomePageVideosResponse } from '@/interfaces'
import { VideoService } from '@/services'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)
const VideosList = dynamic(
	() => import('@/components/videos/general/VideosList')
)

// export const getServerSideProps: GetServerSideProps<{
// 	// data: IHomePageVideosResponse
// }> = async () => {
// 	// const { data } = await VideoService.getHomePageVideos()
// 	return { props: { data } }
// }

export default function HomePage() {
	return (
		<>
			<AppHead title='Головна сторінка' />
			<HomeLayout autoShowSidebar>
				{/*<CategoryPills data={Object.values(data.facetDistribution.tags)} />*/}
				{/*<VideosList videos={data.hits} />*/}
			</HomeLayout>
		</>
	)
}
