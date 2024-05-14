import { AppHead, SignUpForm } from '@/components'
import { NextPage } from 'next'

const SignUpPage: NextPage = () => {
	return (
		<>
			<AppHead title='Реєстрація' />
			<div className='loader-container' children={<SignUpForm />} />
		</>
	)
}

export default SignUpPage
