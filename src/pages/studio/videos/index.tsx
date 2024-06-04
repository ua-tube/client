import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AppHead, DynamicIcon } from '@/components'
import { useTranslation } from 'next-i18next'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { FC } from 'react'

const VideosTable = dynamic(
	() => import('@/components/studio/video/VideosTable'),
	{
		ssr: false
	}
)

const StudioLayout = dynamic(
	() => import('@/components/layouts/studio/StudioLayout'),
	{
		ssr: false,
		loading: () => <DynamicIcon name='loader' className='loader-container' />
	}
)

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
	props: {
		...(await serverSideTranslations(locale || 'uk', [
			'common',
			'general',
			'studio'
		]))
	}
})

const StudioVideosPage: FC = () => {
	const { t } = useTranslation('studio')

	return (
		<>
			<AppHead title={t('contentChannel')} />
			<StudioLayout>
				<h2 className='text-3xl font-bold tracking-tight flex items-center py-4'>
					{t('contentChannel')}
				</h2>
				<VideosTable />
			</StudioLayout>
		</>
	)
}

export default StudioVideosPage
