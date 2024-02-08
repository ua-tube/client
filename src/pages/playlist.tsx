import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PlaylistContent } from '@/components/playlist'
import { HomeLayout } from '@/components/layouts'
import { IPlaylist } from '@/interfaces'
import { AppHead } from '@/components'
import { playlists } from '@/data'

export const getServerSideProps: GetServerSideProps<{
	list: IPlaylist
}> = async ({ query }) => {

	const listId = query?.listId as string
	let list: IPlaylist = { ...playlists[0], id: query?.listId as string || 'err' }
	if (listId && playlists.some(s => s.id === listId))
		list = playlists.find(value => value.id === listId)!
	return { props: { list } }
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
