import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import SearchContent from '@/components/search/SearchContent'
import { AppHead, DynamicIcon } from '@/components'
import { IVideo } from '@/interfaces'
import dynamic from 'next/dynamic'
import { videos } from '@/data'

const HomeLayout = dynamic(
	() => import('@/components/layouts/home'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

export const getServerSideProps: GetServerSideProps<{
	filteredVideos: IVideo[], search: string
}> = async ({ query, locale }) => {
	let filteredVideos = videos
	const search = query.query ? (query.query as string) : ''
	if (search !== '')
		filteredVideos = videos.filter(value => value.title.toLowerCase().startsWith(search.trim()))
	return { props: { filteredVideos, search } }
}

export default function SearchPage({
																		 filteredVideos,
																		 search
																	 }: InferGetServerSidePropsType<typeof getServerSideProps>) {

	return <>
		<AppHead title={`Пошук за '${search}'`} />
		<HomeLayout>
			<SearchContent videos={filteredVideos} />
		</HomeLayout>
	</>

}
