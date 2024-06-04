import { ChannelPersonalizationTabsKey } from '@/types'
import { buttonVariants } from '@/components'
import { useTranslation } from 'next-i18next'
import { TabType } from '@/interfaces'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC } from 'react'

const EditImagesTab = dynamic(() => import('./EditImagesTab'))
const EditInfoTab = dynamic(() => import('./EditInfoTab'))

interface IStudioPersonalizationTabsProps {
	tab: ChannelPersonalizationTabsKey
}

const StudioPersonalizationTabs: FC<IStudioPersonalizationTabsProps> = ({
	tab
}) => {
	const { t } = useTranslation('studio')

	const tabs: TabType<ChannelPersonalizationTabsKey>[] = [
		{ key: 'images', title: t('channelDesign'), children: <EditImagesTab /> },
		{ key: 'details', title: t('channelInfo'), children: <EditInfoTab /> }
	]

	return (
		<div>
			<h2 className='text-3xl font-bold tracking-tight flex items-center py-4'>
				{t('personalizeChannel')}
			</h2>
			<div
				className='space-x-3 border-accent border-b pb-2'
				children={tabs.map((value, index) => (
					<Link
						key={index}
						children={value.title}
						href={`/studio/personalization?tab=${value.key}`}
						className={buttonVariants({
							variant: value.key === tab ? 'secondary' : 'outline'
						})}
					/>
				))}
			/>
			<div
				className='mt-6 mb-10'
				children={tabs.find(value => value?.key === tab)?.children}
			/>
		</div>
	)
}

export default StudioPersonalizationTabs
