import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, RecoveryPassForm, LoginLayout } from '@/components'

export const getServerSideProps: GetServerSideProps<{
	token?: string
	email?: string
}> = async ({ query }) => {
	return {
		props: {
			email: (query?.email as string) || '',
			token: (query?.token as string) || ''
		}
	}
}

export default function UserRecoveryPasswordPage({
	email,
	token
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title='Відновлення паролю' />
			<LoginLayout children={<RecoveryPassForm {...{ email, token }} />} />
		</>
	)
}
