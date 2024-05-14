import { AppHead, SignInForm } from '@/components'

export default function UserLoginPage() {
	return (
		<>
			<AppHead title='Вхід' />
			<div className='loader-container' children={<SignInForm />} />
		</>
	)
}
