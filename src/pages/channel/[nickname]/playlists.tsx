import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import PlaylistsList from '@/components/playlist/general/PlaylistsList'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, buttonVariants, HomeLayout } from '@/components'
import AboutChannel from '@/components/channel/AboutChannel'
import { CreatorService, LibraryService } from '@/services'
import { ICreator, IPlaylist } from '@/interfaces'
import { useEffect, useState } from 'react'
import { getChannelUrl } from '@/utils'
import Link from 'next/link'

export const getServerSideProps: GetServerSideProps<{
	creator: ICreator
}> = async ({ query, locale }) => {
	const nickname = (query?.nickname as string) || ''
	try {
		const { data: creator } = await CreatorService.getCreatorByNicknameOrUserId(
			{ nickname }
		)
		return {
			props: {
				creator,
				...(await serverSideTranslations(locale || 'uk', [
					'common',
					'general',
					'videos',
					'home-sidebar',
					'notifications',
					'playlist'
				]))
			}
		}
	} catch (e) {
		return {
			redirect: {
				permanent: true,
				destination: `/404?message=${encodeURIComponent('Канал більше не доступний')}`
			}
		}
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
									variant: value.key === 'playlists' ? 'secondary' : 'outline'
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
