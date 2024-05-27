export const getImageUrl = (src?: string) =>src?
	`${process.env.STORAGE_SERVER_URL}${src}` : '/empty.jpg'
