interface IUser {
	id: string
	email: string
	role?: 'USER' | 'ADMIN'
}

export type { IUser }
