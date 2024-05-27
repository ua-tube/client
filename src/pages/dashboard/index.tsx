import { AppHead, DynamicIcon } from '@/components'
import { FC } from 'react'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async () => {
	return { redirect: { permanent: true, destination: '/dashboard/videos' } }
}

const DashboardPage: FC = () => {
	return (
		<>
			<AppHead title='Перенаправлення...' />
			<DynamicIcon name='loader' className='loader-container animate-spin' />
		</>
	)
}

export default DashboardPage
