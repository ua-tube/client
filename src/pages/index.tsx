import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ISearchVideosResponse } from '@/interfaces'
import { AppHead, DynamicIcon } from '@/components'
import { VideoService } from '@/services'
import dynamic from 'next/dynamic'
import { useState } from 'react'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)
const VideosList = dynamic(
	() => import('@/components/videos/general/VideosList')
)

export const getServerSideProps: GetServerSideProps<{
	data: ISearchVideosResponse
}> = async () => {
	const { data } = await VideoService.getHomePageVideos()
	return { props: { data } }
}

export default function HomePage({
	data
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [currTag, setCurrTag] = useState<string>()

	return (
		<>
			<AppHead title='Головна сторінка' />
			<HomeLayout autoShowSidebar>
				<CategoryPills
					data={Object.keys(data.facetDistribution.tags)}
					value={currTag}
					onChange={s => setCurrTag(s)}
				/>
				{data?.hits && (
					<VideosList
						videos={
							currTag
								? data.hits.filter(v => v.tags?.some(v => v === currTag))
								: data.hits
						}
					/>
				)}
			</HomeLayout>
		</>
	)
}
