import { LibraryService, SubscriptionsService } from '@/services'
import { FC, useEffect, useState } from 'react'
import { getChannelUrl } from '@/utils'
import { ICreator } from '@/interfaces'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DynamicIcon
} from '@/components'

interface IAboutChannelModalProps {
	showModal: boolean
	setShowModal: (s: boolean) => void
	creator: ICreator
}

type CreatorStats = {
	totalViews?: string
	count?: string
	subscribersCount?: string
}

const AboutChannelModal: FC<IAboutChannelModalProps> = ({
	showModal,
	setShowModal,
	creator
}) => {
	const [data, setData] = useState<CreatorStats>({
		count: '0',
		totalViews: '0',
		subscribersCount: '0'
	})

	useEffect(() => {
		;(async () => {
			if (creator && showModal) {
				const [
					{
						data: { subscribersCount }
					},
					{ data: count },
					{ data: totalViews }
				] = await Promise.all([
					SubscriptionsService.getSubscriptionInfo(creator.id),
					LibraryService.getTotalVideosForCreator(creator.id),
					LibraryService.getTotalVideoViewsForCreator(creator.id)
				])

				setData({
					totalViews,
					subscribersCount,
					count
				})
			}
		})()
	}, [showModal])

	return (
		<Dialog open={showModal} onOpenChange={setShowModal}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Відомості про канал</DialogTitle>
				</DialogHeader>
				<div className='flex text-sm' children={creator.description} />
				<div className='flex flex-col gap-y-3'>
					{creator.email && (
						<a
							href={`mailto:${creator.email}`}
							className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'
						>
							<DynamicIcon name='message-circle' />
							<span children={creator.email} />
						</a>
					)}

					<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
						<DynamicIcon name='merge' />
						<span
							children={getChannelUrl(creator.nickname, undefined, false)}
						/>
					</div>

					<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
						<DynamicIcon name='user-check' />
						<span
							children={`Підписалося ${data.subscribersCount} користувачів`}
						/>
					</div>

					<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
						<DynamicIcon name='monitor-play' />
						<span children={`${data.count} відео`} />
					</div>

					<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
						<DynamicIcon name='bar-chart-3' />
						<span children={`${data.totalViews} переглядів`} />
					</div>

					<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
						<DynamicIcon name='calendar' />
						<span
							children={`Канал створено ${new Date(creator.createdAt || '').toLocaleDateString()} р.`}
						/>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default AboutChannelModal
