import { IPagination, IPlaylist, IVideo, UseState } from '@/interfaces'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { LibraryService } from '@/services'
import { toastError } from '@/utils'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DynamicIcon
} from '@/components'

const PlaylistCreateForm = dynamic(
	() => import('@/components/forms/PlaylistCreateForm')
)

interface IPlaylistsModalProps {
	video?: IVideo
	open: boolean
	setOpen: UseState<boolean>
}

const PlaylistsModal: FC<IPlaylistsModalProps> = ({ setOpen, open, video }) => {
	const { t } = useTranslation('playlist')

	const [playlists, setPlaylists] = useState<IPlaylist[]>([])
	const [params, setParams] = useState<IPagination>({ perPage: 10, page: 1 })
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [showPlaylists, setShowPlaylists] = useState<boolean>(true)
	const [currPlaylistIds, setCurrPlaylistIds] = useState<string[]>([])

	const updateData = async () => {
		try {
			const { data } = await LibraryService.getPlaylistsBySelf(params)
			const newItems = [...playlists, ...data.list]

			const uniquePlaylists = Array.from(new Set(newItems.map(p => p.id)))
				.map(id => newItems.find(p => p.id === id))
				.filter(v => v !== undefined) as IPlaylist[]

			setPlaylists(uniquePlaylists)
			setHasMore(uniquePlaylists.length < (data.pagination.total || 0))

			if (uniquePlaylists.length < (data.pagination.total || 0)) {
				setParams(p => ({ ...p, page: +p.page + 1 }))
			}
		} catch (e) {
			console.error(e)
		}
	}

	const updateCurrVideoPlaylists = async (videoId: string) => {
		try {
			const { data } = await LibraryService.getCurrVideoPlaylistIds(videoId)
			setCurrPlaylistIds(data)
		} catch (e) {
			console.error(e)
		}
	}

	const onAddOrRemoveItemToPlaylist = async (
		playlist: IPlaylist,
		alreadyInPlaylist: boolean
	) => {
		try {
			if (video) {
				if (alreadyInPlaylist)
					await LibraryService.removeItemToPlaylist({
						videoId: video.id,
						t: playlist.id
					})
				else
					await LibraryService.addItemToPlaylist({
						videoId: video.id,
						t: playlist.id
					})

				toast.success(
					t(
						alreadyInPlaylist
							? 'videoRemovedFromListSucc'
							: 'videoAddedToListSucc',
						{ title: playlist.title }
					)
				)

				await updateCurrVideoPlaylists(video.id!)
			}
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		;(async () => {
			if (open) await updateData()
		})()
	}, [open])

	useEffect(() => {
		;(async () => {
			if (open && video) {
				setShowPlaylists(true)
				setHasMore(false)
				await updateCurrVideoPlaylists(video.id)
			}
		})()
	}, [open, video])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-[18rem] sm:min-w-[27rem]'>
				<DialogHeader>
					<DialogTitle>{t('saveToNewPlaylist')}</DialogTitle>
				</DialogHeader>
				{showPlaylists ? (
					<div className='space-y-3.5 py-3 w-full'>
						{playlists.map((value, index) => {
							const alreadyInPlaylist = currPlaylistIds.includes(value.id)
							return (
								<div
									className='flex items-center justify-between space-x-2 rounded-lg bg-muted p-1.5 border border-muted-foreground'
									key={index}
								>
									<div className='flex gap-3 items-center'>
										<DynamicIcon name='list-plus' className='text-lg' />
										<h4 className='text-lg truncate'>{value.title}</h4>
									</div>
									<Button
										variant={alreadyInPlaylist ? 'destructive' : 'default'}
										onClick={async () =>
											onAddOrRemoveItemToPlaylist(value, alreadyInPlaylist)
										}
									>
										{t(alreadyInPlaylist ? 'delete' : 'add')}
									</Button>
								</div>
							)
						})}
						<div className='flex justify-between items-center gap-1'>
							<Button disabled={!hasMore} onClick={updateData}>
								{t('loadMore')}
							</Button>
							<Button onClick={() => setShowPlaylists(false)}>
								{t('addToNewPlaylist')}
							</Button>
						</div>
					</div>
				) : (
					<PlaylistCreateForm
						videoId={video?.id}
						onFinish={async () => {
							setShowPlaylists(true)
							setOpen(false)
							setHasMore(true)
							await updateData()
						}}
					/>
				)}
			</DialogContent>
		</Dialog>
	)
}

export default PlaylistsModal
