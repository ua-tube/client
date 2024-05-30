import { AppHead, buttonVariants } from '@/components'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function NotFoundPage() {
	const { query } = useRouter()

	const message = query.message ? query.message.toString() : null
	return (
		<>
			<AppHead title='404' />
			<div className='min-h-screen flex flex-col items-center justify-center bg-background p-4'>
				<h1 className='text-6xl font-bold text-muted-foreground'>404</h1>
				{message && <p className='mt-2 text-lg text-red-500'>{message}</p>}
				<Link
					href='/'
					className={buttonVariants({ variant: 'outline', className: 'mt-4' })}
				>
					Повернутися на головну
				</Link>
			</div>
		</>
	)
}
