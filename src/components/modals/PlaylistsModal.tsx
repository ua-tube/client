import {
	Checkbox,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Label
} from '@/components'
import { IVideo } from '@/interfaces'
import { playlists } from '@/data'
import { FC, useState } from 'react'

interface IPlaylistsModalProps {
	video?: IVideo
	open: boolean
	setOpen: (s: boolean) => void
}

const PlaylistsModal: FC<IPlaylistsModalProps> = ({ setOpen, open, video }) => {
	const [currPlaylists, setCurrPlaylists] = useState<string[]>(['1'])

	const onPlaylistSave = () => {
		// TODO make logic for save video in playlist
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className='max-w-[18rem]'>
				<DialogHeader>
					<DialogTitle>Зберегти в плейліст</DialogTitle>
				</DialogHeader>
				<div
					className='space-y-3.5 py-3'
					children={playlists.map((value, index) => (
						<div className='flex items-center space-x-2' key={index}>
							<Checkbox
								id={`c-${value.id}`}
								checked={currPlaylists.includes(value.id)}
							/>
							<Label htmlFor={`c-${value.id}`} children={value.name} />
						</div>
					))}
				/>
			</DialogContent>
		</Dialog>
	)
}

export default PlaylistsModal
