interface ICreator {
	id: string
	displayName: string
	nickname: string
	description?: string
	email?: string
	thumbnailUrl: string
	bannerUrl?: string
	status: CreatorStatusType
	createdAt?: string
	updatedAt?: string
	subscribersCount?: string
}

type CreatorStatusType = 'CREATED' | 'REGISTERED'

export type { ICreator, CreatorStatusType }
