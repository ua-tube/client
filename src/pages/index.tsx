import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ISearchVideosResponse } from '@/interfaces'
import { AppHead, DynamicIcon } from '@/components'
import { VideoService } from '@/services'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name="loader" className="loader-container" />
})

const CategoryPills = dynamic(
	() => import('@/components/categories/CategoryPills')
)
const VideosList = dynamic(
	() => import('@/components/videos/general/VideosList')
)

export const getServerSideProps: GetServerSideProps<{
	data: ISearchVideosResponse
	tag?: string
}> = async ({ query }) => {
	const tag = (query?.tag as string | undefined)
	let data

	const { data: baseData } = await VideoService.getHomePageVideos()
	data = baseData

	if (tag && tag.length > 0) {
		const { data: newData } = await VideoService.searchVideosByTags({ tags: [tag], perPage: 40, page: 1 })
		data = { ...baseData, hits: newData.results }
	}

	return { props: { data, tag: tag || 'none' } }
}

export default function HomePage({
																	 data, tag
																 }: InferGetServerSidePropsType<typeof getServerSideProps>) {

	const { push } = useRouter()

	return (
		<>
			<AppHead title="Головна сторінка" />
			<HomeLayout autoShowSidebar>
				<CategoryPills
					data={Object.keys(data.facetDistribution.tags)}
					value={tag}
					onChange={tag => push({ pathname: '/', query: { tag } })}
				/>
				{data?.hits && (<VideosList videos={data.hits} />)}
			</HomeLayout>
		</>
	)
}
