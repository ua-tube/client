import { AppHead, buttonVariants, HomeLayout } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import AboutChannel from '@/components/channel/AboutChannel'
import { CreatorService, LibraryService } from '@/services'
import { ICreator, IPlaylist } from '@/interfaces'
import { getChannelUrl } from '@/utils'
import Link from 'next/link'
import PlaylistsList from '@/components/playlist/general/PlaylistsList'
import { useEffect, useState } from 'react'

export const getServerSideProps: GetServerSideProps<{
	creator: ICreator
}> = async ({ query }) => {
	const nickname = (query?.nickname as string) || ''
	try {
		const { data: creator } = await CreatorService.getCreatorByNicknameOrUserId(
			{ nickname }
		)
		return { props: { creator } }
	} catch (e) {
		return { redirect: { permanent: true, destination: '/' } }
	}
}

export default function ChannelPlaylistsPage({
	creator
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [playlists, setPlaylists] = useState<IPlaylist[]>([])

	useEffect(() => {
		;(async () => {
			const { data } = await LibraryService.getPlaylistsByCreator(creator.id)
			setPlaylists(data)
		})()
	}, [])

	return (
		<>
			<AppHead title={`Відео ${creator.displayName}`} />
			<HomeLayout autoShowSidebar openInDrawer>
				<div className='max-w-7xl mx-auto flex flex-col gap-y-5'>
					<AboutChannel creator={creator} />
					<div
						className='space-x-3 border-accent border-b pb-2'
						children={[
							{ key: 'videos', title: 'Відео' },
							{ key: 'playlists', title: 'Плейлісти' }
						]?.map((value, index) => (
							<Link
								key={index}
								children={value.title}
								href={getChannelUrl(creator.nickname, value.key, true)}
								className={buttonVariants({
									variant: value.key === 'videos' ? 'secondary' : 'outline'
								})}
							/>
						))}
					/>

					<PlaylistsList playlists={playlists} />
				</div>
			</HomeLayout>
		</>
	)
}