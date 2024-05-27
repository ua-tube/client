import { AppHead, SignInForm, LoginLayout } from '@/components'

export default function UserLoginPage() {
	return (
		<>
			<AppHead title='Вхід' />
			<LoginLayout children={<SignInForm />} />
		</>
	)
}
