import { IPagination, IPlaylist, IVideo, UseState } from '@/interfaces'
import { FC, useEffect, useState } from 'react'
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
	const [playlists, setPlaylists] = useState<IPlaylist[]>([])
	const [params, setParams] = useState<IPagination>({ perPage: 10, page: 1 })
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [showPlaylists, setShowPlaylists] = useState<boolean>(true)

	const updateData = async () => {
		try {
			const { data } = await LibraryService.getPlaylistsBySelf(params)
			const newItems = [...playlists, ...data.list]
			setPlaylists(newItems)
			setHasMore(newItems.length < (data.pagination.total || 0))
			if (hasMore) setParams(p => ({ ...p, page: +p.page + 1 }))
		} catch (e) {}
	}

	useEffect(() => {
		;(async () => updateData())()
	}, [params, open])

	useEffect(() => {
		setShowPlaylists(true)
		setHasMore(false)
	}, [open])

	const onAddItemToPlaylist = async (playlist: IPlaylist) => {
		try {
			if (video) {
				await LibraryService.addItemToPlaylist({
					videoId: video.id,
					t: playlist.id
				})
				toast.success(`Відео успішно додано в плейліст "${playlist.title}"`)
			} else toast.error(`Відео не знайдено!`)
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-[18rem] sm:min-w-[27rem]'>
				<DialogHeader>
					<DialogTitle>Зберегти відео в плейліст</DialogTitle>
				</DialogHeader>
				{showPlaylists ? (
					<div className='space-y-3.5 py-3 w-full'>
						{playlists.map((value, index) => (
							<div
								className='flex items-center justify-between space-x-2 rounded-lg bg-muted p-1.5 border border-muted-foreground'
								key={index}
							>
								<div className='flex gap-3 items-center'>
									<DynamicIcon name='list-plus' className='text-lg' />
									<h4 className='text-lg truncate'>{value.title}</h4>
								</div>
								<Button
									variant='default'
									onClick={async () => onAddItemToPlaylist(value)}
								>
									Додати
								</Button>
							</div>
						))}
						<div className='flex justify-between items-center gap-1'>
							<Button disabled={!hasMore} onClick={updateData}>
								Завантажити ще...
							</Button>
							<Button onClick={() => setShowPlaylists(false)}>
								Додати в новий плейліст
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
