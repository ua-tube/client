import { DynamicIcon, AppHead } from '@/components'
import dynamic from 'next/dynamic'
import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import { ChannelPersonalizationTabsKey } from '@/types'
import { channelPersonalizationTabsKeys } from '@/data'

const DashboardLayout = dynamic(
	() => import('@/components/layouts/dashboard'),
	{ loading: () => <DynamicIcon name="loader" className="loader-container" /> }
)

const DashboardPersonalizationTabs = dynamic(
	() => import('@/components/dashboard/personalization/personalization-tabs'))


export const getServerSideProps: GetServerSideProps<{
	tab: ChannelPersonalizationTabsKey
}> = async ({ query }) => {
	let tab: ChannelPersonalizationTabsKey = 'images'

	if (query.tab && channelPersonalizationTabsKeys.includes(query.tab as ChannelPersonalizationTabsKey))
		tab = query.tab as ChannelPersonalizationTabsKey

	return { props: { tab } }
}

export default function ChannelPersonalizationPage({ tab }: InferGetServerSidePropsType<typeof getServerSideProps>) {


	return <>
		<AppHead title="Персоналізація каналу" />
		<DashboardLayout>
			<DashboardPersonalizationTabs tab={tab} />
		</DashboardLayout>
	</>

}

