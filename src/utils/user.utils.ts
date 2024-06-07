export const getUserInitials = (i?: string) =>
	i
		?.split(' ', 2)
		.map(n => n[0])
		.join('')
