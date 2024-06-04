import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AppHead, LoginLayout, SignInForm } from '@/components'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || 'uk', ['common', 'auth']))
	}
})

export default function UserLoginPage() {
	const { t } = useTranslation('auth')
	return (
		<>
			<AppHead title={t('loginToAccount')} />
			<LoginLayout children={<SignInForm />} />
		</>
	)
}
