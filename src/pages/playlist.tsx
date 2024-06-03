import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { LibraryService } from '@/services'
import { IPlaylist } from '@/interfaces'
import { useRouter } from 'next/router'

const HomeLayout = dynamic(() => import('@/components/layouts/home'), {
	loading: () => <DynamicIcon name='loader' className='loader-container' />
})

const PlaylistContent = dynamic(
	() => import('@/components/playlist/PlaylistContent'),
	{ loading: () => <DynamicIcon name='loader' className='loader-container' /> }
)

const notFoundDestination = `/404?message=${encodeURIComponent('Даного плейліста не знайдено!')}`

export const getServerSideProps: GetServerSideProps<{
	listId: string
}> = async ({ query }) => {
	const listId = query?.listId as string
	return listId && listId !== ''
		? { props: { listId } }
		: {
				redirect: {
					permanent: true,
					destination: notFoundDestination
				}
			}
}

export default function PlaylistPage({
	listId
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { replace } = useRouter()
	const [playlist, setPlaylist] = useState<IPlaylist>()

	useEffect(() => {
		;(async () => {
			try {
				const { data } = await LibraryService.getAllVideosByPlaylist({
					page: 1,
					perPage: 10,
					t: listId
				})
				setPlaylist(data)
			} catch (e) {
				await replace(notFoundDestination)
			}
		})()
	}, [listId])

	return (
		<>
			<AppHead title={playlist?.title || 'Playlist'} />
			<HomeLayout autoShowSidebar>
				<PlaylistContent playlist={playlist} listId={listId} />
			</HomeLayout>
		</>
	)
}
