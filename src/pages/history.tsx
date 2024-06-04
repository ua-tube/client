import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { HomeLayout } from '@/components/layouts'
import HistoryContent from '@/components/history'
import { GetServerSideProps } from 'next'
import { AppHead } from '@/components'
import { useTranslation } from 'next-i18next'


export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || 'uk', [
			'general',
			'common',
			'views-history',
			'notifications',
			'home-sidebar'
		]))
	}
})

export default function HistoryPage() {
	const { t } = useTranslation('views-history')
	return (
		<>
			<AppHead title={t('viewsHistory')} />
			<HomeLayout openInDrawer>
				<HistoryContent />
			</HomeLayout>
		</>
	)
}
