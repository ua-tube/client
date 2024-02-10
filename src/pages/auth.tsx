import { AppHead, SignInForm, SignUpForm, RecoveryPassForm } from '@/components'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { authFormType } from '@/data'

export const getServerSideProps: GetServerSideProps<{
	currFormType: typeof authFormType[number]
}> = async ({ query }) => {

	let currFormType: typeof authFormType[number] = 'signIn'

	if (query?.authType && authFormType.includes(query.authType as any))
		currFormType = query.authType as any

	return { props: { currFormType } }
}

export default function AuthPage({ currFormType }: InferGetServerSidePropsType<typeof getServerSideProps>) {

	return <>
		<AppHead title={
			currFormType === 'signIn' ?
				'Вхід' :
				currFormType === 'signUp' ?
					'Реєстрація' :
					'Відновлення паролю'
		} />
		<div className="loader-container" children={currFormType === 'signIn' ?
			<SignInForm /> :
			currFormType === 'signUp' ?
				<SignUpForm /> :
				<RecoveryPassForm />
		} />
	</>
}

