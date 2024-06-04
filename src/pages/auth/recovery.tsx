import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { AppHead, LoginLayout, RecoveryPassForm } from '@/components'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps<{
	token?: string
	email?: string
}> = async ({ query, locale }) => {
	return {
		props: {
			email: (query?.email as string) || '',
			token: (query?.token as string) || '',
			...(await serverSideTranslations(locale || 'uk', ['common', 'auth']))
		}
	}
}

export default function UserRecoveryPasswordPage({
	email,
	token
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { t } = useTranslation('auth')

	return (
		<>
			<AppHead title={t('recoverAccessToAccount')} />
			<LoginLayout children={<RecoveryPassForm {...{ email, token }} />} />
		</>
	)
}
