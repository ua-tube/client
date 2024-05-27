import { FC, useState } from 'react'
import { DialogContent, DialogHeader, DialogTitle, DynamicIcon, Dialog } from '@/components'
import { getChannelUrl } from '@/utils'
import { ICreator } from '@/interfaces'

interface IAboutChannelModalProps {
	showModal: boolean
	setShowModal: (s: boolean) => void
	creator: ICreator
}

type CreatorStats = {
	totalViews?: number
	count?: number
	subscribersCount?: number
}

const AboutChannelModal: FC<
	IAboutChannelModalProps
> = ({
			 showModal,
			 setShowModal,
			 creator
		 }) => {
	const [data, setData] = useState<CreatorStats>({
		count: 0,
		totalViews: 0,
		subscribersCount: 0
	})


	return <Dialog open={showModal} onOpenChange={setShowModal}>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Про канал</DialogTitle>
			</DialogHeader>
			<div className="flex text-sm" children={creator.description} />
			<DialogTitle>Відомості про канал</DialogTitle>
			<div className="flex flex-col gap-y-3">
				<div className="flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2">
					<DynamicIcon name="merge" />
					<span
						children={getChannelUrl(creator.nickname, undefined, false)}
					/>
				</div>

				<div className="flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2">
					<DynamicIcon name="user-check" />
					<span children={`Підписалося ${data.subscribersCount} користувачів`} />
				</div>

				<div className="flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2">
					<DynamicIcon name="monitor-play" />
					<span children={`${data.count} відео`} />
				</div>

				<div className="flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2">
					<DynamicIcon name="bar-chart-3" />
					<span children={`${data.totalViews} переглядів`} />
				</div>

				<div className="flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2">
					<DynamicIcon name="calendar" />
					<span
						children={`Канал створено ${new Date(creator.createdAt || '').toLocaleDateString()} р.`}
					/>
				</div>
			</div>
		</DialogContent>
	</Dialog>
}

export default AboutChannelModal
