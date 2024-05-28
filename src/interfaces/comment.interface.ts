import { ICreator } from './'

type UserVoteType = 'Like' | 'Dislike' | 'None'

interface IComment {
	id: string
	videoId: string
	parentCommentId?: string
	parentComment?: IComment
	creatorId: string
	creator: ICreator
	comment: string
	likesCount: number
	dislikesCount: number
	repliesCount: number
	replies?: IComment[]
	createdAt: string
	editedAt: string
}

interface ILikedOrDislikedComment {
	videoCommentId: string
	type: UserVoteType
}

export type { IComment, ILikedOrDislikedComment, UserVoteType }
