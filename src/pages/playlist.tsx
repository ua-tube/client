import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, DynamicIcon } from '@/components'
import { useEffect, useState } from 'react'
import { LibraryService } from '@/services'
import { IPlaylist } from '@/interfaces'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'

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
}> = async ({ query, locale }) => {
	const listId = query?.listId as string
	return listId && listId !== ''
		? {
				props: {
					listId,
					...(await serverSideTranslations(locale || 'uk', [
						'common',
						'general',
						'videos',
						'home-sidebar',
						'notifications',
						'share',
						'playlist'
					]))
				}
			}
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
	const { t } = useTranslation('playlist')
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
			<AppHead title={playlist?.title || t('playlist')} />
			<HomeLayout autoShowSidebar>
				<PlaylistContent playlist={playlist} listId={listId} />
			</HomeLayout>
		</>
	)
}
