import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { ICreator, IVideo } from './'

interface IPlaylist {
	id: string
	name: string
	imgUrl?: string
	icon?: keyof typeof dynamicIconImports
	channel?: ICreator
	videos?: IVideo[]
	viewsCount?: number
	videosCount?: number
	isPrivate?: boolean
	createdAt?: string
	updatedAt?: string
}

export type { IPlaylist }
