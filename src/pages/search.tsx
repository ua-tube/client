import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import SearchContent from '@/components/search/SearchContent'
import { AppHead, DynamicIcon } from '@/components'
import { ISearchVideosResponse } from '@/interfaces'
import dynamic from 'next/dynamic'
import { VideoService } from '@/services'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const notFoundDestination = `/404?message=${encodeURIComponent('Нічого не знайдено за цим запитом')}`

export const getServerSideProps: GetServerSideProps<{
	search: string
	data: ISearchVideosResponse
}> = async ({ query, locale }) => {
	const currPage = query.page as string | undefined
	const currPerPage = query.page as string | undefined
	const search = query.query as string | undefined
	if (search && search !== '') {
		const { data } = await VideoService.getSearchVideos({
			page: currPage || 1,
			perPage: currPerPage || 24,
			q: search
		})
		return { props: { search, data } }
	} else
		return { redirect: { permanent: true, destination: notFoundDestination } }
}

export default function SearchPage({
	data,
	search
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={`Пошук за '${search}'`} />
			<HomeLayout openInDrawer>
				<SearchContent videos={data.hits} />
			</HomeLayout>
		</>
	)
}
