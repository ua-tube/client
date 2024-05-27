import { Avatar, AvatarImage, AvatarFallback, Button, DynamicIcon } from '@/components'
import { formatNumbers, getImageUrl, getUserInitials, toastError } from '@/utils'
import { SubscriptionsService } from '@/services'
import { FC, useState, useEffect } from 'react'
import { ICreator } from '@/interfaces'
import dynamic from 'next/dynamic'

const AboutChannelModal = dynamic(() => import( './AboutChannelModal'))

interface IAboutChannelProps {
	creator: ICreator
}

const AboutChannel: FC<IAboutChannelProps> = ({ creator }) => {
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)

	const onSubscribeClick = async () => {
		try {
			if (subscribed) await SubscriptionsService.unsubscribe({ targetId: creator?.id! })
			else await SubscriptionsService.subscribe({ targetId: creator?.id! })
		} catch (e) {
			toastError(e)
		}
		setSubscribed(s => !s)
	}

	useEffect(() => {
		(async () => {
			const { data: { status } } = await SubscriptionsService.checkSubscription(creator.id)
			setSubscribed(status)
		})()
	}, [])

	return (
		<div className="space-y-5">
			<div className="w-full h-48">
				<img
					src={getImageUrl(creator.bannerUrl)}
					className="w-full h-full object-cover rounded-lg"
					alt="profile-bg-img"
				/>
			</div>
			<div className="flex flex-col items-start md:flex-row md:items-center gap-4">
				<Avatar className="size-16 sm:size-20 md:size-40">
					<AvatarImage src={creator.thumbnailUrl} />
					<AvatarFallback children={getUserInitials(creator.displayName)} />
				</Avatar>
				<div className="flex flex-col gap-y-1.5 items-start">
					<h1
						className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
						children={creator.displayName}
					/>
					<ul className="flex flex-col md:flex-row md:ml-6 space-x-8 items-baseline md:items-center list-disc">
						<li className="leading-7" children={creator.nickname} />
						<li
							className="leading-7"
							children={`Підписалося ${formatNumbers(0)} користувачів`}
						/>
						<li className="leading-7" children={`${0} відео`} />
					</ul>
					<div className="flex space-x-2 items-center">
						<span
							className="uppercase truncate max-w-xs"
							children={creator.description}
						/>
						<button
							children={<DynamicIcon name="arrow-right" />}
							onClick={() => setShowModal(true)}
						/>
					</div>
					<Button
						children={subscribed ? 'Відписатися' : 'Підписатися'}
						variant={subscribed ? 'outline' : 'default'}
						className="flex max-w-min rounded-lg"
						onClick={onSubscribeClick}
						size="sm"
					/>
				</div>
				<AboutChannelModal {...{ setShowModal, showModal, creator }} />
			</div>
		</div>
	)
}

export default AboutChannel
