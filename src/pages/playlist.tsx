import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import { IPlaylist } from '@/interfaces'
import { playlists } from '@/data'
import dynamic from 'next/dynamic'

const HomeLayout = dynamic(
	() => import('@/components/layouts/home'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const PlaylistContent = dynamic(() => import( '@/components/playlist/playlist-content'))

export const getServerSideProps: GetServerSideProps<{ list: IPlaylist }> = async ({ query, locale }) => {
	const listId = query?.listId as string
	let list: IPlaylist = playlists[0]

	if (listId && playlists.some(s => s.id === listId))
		list = playlists.find(value => value.id === listId) || playlists[0]

	return {		props: {			list		}	}
}


export default function PlaylistPage({ list }: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title={list.name} />
			<HomeLayout>
				<PlaylistContent list={list} />
			</HomeLayout>
		</>
	)
}
