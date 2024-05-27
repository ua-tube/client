import { AppHead, SignUpForm, LoginLayout } from '@/components'
import { NextPage } from 'next'

const SignUpPage: NextPage = () => {
	return (
		<>
			<AppHead title='Реєстрація' />
			<LoginLayout children={<SignUpForm />} />
		</>
	)
}

export default SignUpPage
