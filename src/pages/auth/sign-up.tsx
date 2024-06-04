import { AppHead, LoginLayout, SignUpForm } from '@/components'
import { GetServerSideProps } from 'next'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || 'uk', ['common', 'auth']))
	}
})

export default function UserRegisterPage() {
	const { t } = useTranslation('auth')

	return (
		<>
			<AppHead title={t('registerNewAccount')} />
			<LoginLayout children={<SignUpForm />} />
		</>
	)
}
