import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { PlaylistContent } from '@/components/playlist'
import { HomeLayout } from '@/components/layouts'
import { IPlaylist } from '@/interfaces'
import { AppHead } from '@/components'
import { playlists } from '@/data'

export const getServerSideProps: GetServerSideProps<{
	list: IPlaylist
}> = async ({ query }) => {
	return { props: { list: { ...playlists[0], id: query?.listId as string || 'err' } } }
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
