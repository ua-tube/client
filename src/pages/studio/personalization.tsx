import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { channelPersonalizationTabsKeys } from '@/data'
import { ChannelPersonalizationTabsKey } from '@/types'
import { AppHead, DynamicIcon } from '@/components'
import dynamic from 'next/dynamic'

const StudioLayout = dynamic(
	() => import('@/components/layouts/studio/StudioLayout'),
	{
		loading: () => <DynamicIcon name='loader' className='loader-container' />,
		ssr: false
	}
)

const StudioPersonalizationTabs = dynamic(
	() => import('@/components/studio/personalization/PersonalizationTabs')
)

export const getServerSideProps: GetServerSideProps<{
	tab: ChannelPersonalizationTabsKey
}> = async ({ query, locale }) => {
	let tab: ChannelPersonalizationTabsKey = 'images'

	if (
		query.tab &&
		channelPersonalizationTabsKeys.includes(
			query.tab as ChannelPersonalizationTabsKey
		)
	)
		tab = query.tab as ChannelPersonalizationTabsKey

	return {
		props: {
			tab,
			...(await serverSideTranslations(locale || 'uk', [
				'common',
				'general',
				'studio'
			]))
		}
	}
}

export default function ChannelPersonalizationPage({
	tab
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	return (
		<>
			<AppHead title='Персоналізація каналу' />
			<StudioLayout>
				<StudioPersonalizationTabs tab={tab} />
			</StudioLayout>
		</>
	)
}
