import { AppHead, DynamicIcon } from '@/components'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
	return { redirect: { permanent: true, destination: '/auth/sign-in' } }
}

export default function StudioVideoPage() {
	return (
		<>
			<AppHead title='Redirect To Login' />
			<DynamicIcon name='loader' className='loader-container' />
		</>
	)
}
