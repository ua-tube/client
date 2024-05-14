import { toast } from 'sonner'

const errorCatch = (e: any): string | string[] | undefined => {
	if (e?.response) return e?.response?.data?.message
	else if (typeof e == 'string') return e
}
const toastError = (error: any) => {
	const strError = errorCatch(error)
	if (strError !== undefined && strError !== '' && typeof strError === 'string')
		toast.error(!strError.includes('prisma') ? strError : 'Невідома помилка')
	else if (strError !== undefined && typeof strError !== 'string')
		strError.map(value => toast.error(value, { duration: 3000 }))
}

export { toastError }
