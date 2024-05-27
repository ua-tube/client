import { IPlaylist } from '@/interfaces'
import { $axios } from '@/api/axios'

export const PlaylistsService = {
	async getAll() {
		return $axios.get<IPlaylist[]>('notifications')
	},
}
