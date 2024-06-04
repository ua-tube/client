import { AppHead, DynamicIcon } from '@/components'
import { GetServerSideProps } from 'next'
import { FC } from 'react'

export const getServerSideProps: GetServerSideProps = async () => {
	return { redirect: { permanent: true, destination: '/studio/videos' } }
}

const StudioPage: FC = () => {
	return (
		<>
			<AppHead title='Redirect to studio' />
			<DynamicIcon name='loader' className='loader-container animate-spin' />
		</>
	)
}

export default StudioPage
