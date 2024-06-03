import { Avatar, AvatarFallback, AvatarImage, Button, DynamicIcon } from '@/components'
import { getImageUrl, getUserInitials, toastError } from '@/utils'
import { SubscriptionsService } from '@/services'
import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { ICreator } from '@/interfaces'
import dynamic from 'next/dynamic'
import { useAuth } from '@/hooks'

const AboutChannelModal = dynamic(() => import('./AboutChannelModal'))

interface IAboutChannelProps {
	creator: ICreator
}

const AboutChannel: FC<IAboutChannelProps> = ({ creator }) => {
	const { t } = useTranslation('general')
	const { accessToken, user } = useAuth()
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)

	const onSubscribeClick = async () => {
		try {
			if (subscribed)
				await SubscriptionsService.unsubscribe({ targetId: creator?.id! })
			else await SubscriptionsService.subscribe({ targetId: creator?.id! })
		} catch (e) {
			toastError(e)
		}
		setSubscribed(s => !s)
	}

	useEffect(() => {
		;(async () => {
			if (accessToken) {
				try {
					const {
						data: { status }
					} = await SubscriptionsService.checkSubscription(creator.id)
					setSubscribed(status)
				} catch (e) {}
			}
		})()
	}, [])

	return (
		<div className='space-y-5'>
			<div className='w-full h-48'>
				<img
					src={getImageUrl(creator.bannerUrl)}
					className='w-full h-full object-cover rounded-lg'
					alt='profile-bg-img'
				/>
			</div>
			<div className='flex flex-col items-start md:flex-row md:items-center gap-4'>
				<Avatar className='size-16 sm:size-20 md:size-40'>
					<AvatarImage src={getImageUrl(creator.thumbnailUrl)} />
					<AvatarFallback children={getUserInitials(creator.displayName)} />
				</Avatar>
				<div className='flex flex-col gap-y-1.5 items-start'>
					<h1
						className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'
						children={creator.displayName}
					/>
					<div children={`@${creator.nickname}`} />
					<div className='flex space-x-2 items-center'>
						<span
							className='truncate max-w-xs'
							children={
								creator?.description && creator.description.length > 0
									? creator.description
									: t('showMore')
							}
						/>
						<button
							children={<DynamicIcon name='arrow-right' />}
							onClick={() => setShowModal(true)}
						/>
					</div>
					<Button
						children={t(subscribed ? 'unsubscribe' : 'subscribe')}
						variant={subscribed ? 'outline' : 'default'}
						className='flex max-w-min rounded-lg'
						onClick={onSubscribeClick}
						size='sm'
						disabled={user?.id === creator.id || !user}
					/>
				</div>
				<AboutChannelModal {...{ setShowModal, showModal, creator }} />
			</div>
		</div>
	)
}

export default AboutChannel
