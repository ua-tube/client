import dynamicIconImports from 'lucide-react/dynamicIconImports'
import {
	IApiPaginationResponse,
	ICreator,
	IVideo,
	VideoVisibilityType
} from './'

interface IPlaylist {
	id: string
	creatorId: string
	title: string
	visibility?: VideoVisibilityType
	icon?: keyof typeof dynamicIconImports
	creator?: ICreator
	videos?: IApiPaginationResponse<IVideo>
	metrics?: {
		itemsCount: number
		viewsCount: string
	}
	createdAt?: string
	updatedAt?: string
}

export type { IPlaylist }
