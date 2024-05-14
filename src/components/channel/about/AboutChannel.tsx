import { formatNumbers, getChannelUrl } from '@/utils'
import { IChannel } from '@/interfaces'
import { FC, useState } from 'react'
import {
	Avatar,
	AvatarImage,
	AvatarFallback,
	Button,
	DynamicIcon,
	DialogContent,
	Dialog,
	DialogTitle,
	DialogHeader
} from '@/components'

interface IAboutChannelProps {
	channel: IChannel
}

const AboutChannel: FC<IAboutChannelProps> = ({ channel }) => {
	const [subscribed, setSubscribed] = useState<boolean>(false)
	const [showModal, setShowModal] = useState<boolean>(false)

	const onSubscribeClick = async () => {
		setSubscribed(s => !s)
	}

	return (
		<div className='space-y-5'>
			{channel.profileBgImg && (
				<div className='w-full h-48'>
					<img
						src={channel.profileBgImg}
						className='w-full h-full object-cover rounded-lg'
						alt='profile-bg-img'
					/>
				</div>
			)}
			<div className='flex flex-col items-start md:flex-row md:items-center gap-4'>
				<Avatar className='size-16 sm:size-20 md:size-40'>
					<AvatarImage src={channel.profileImg} />
					<AvatarFallback children={channel.nickName.slice(0, 2)} />
				</Avatar>
				<div className='flex flex-col gap-y-1.5 items-start'>
					<h1
						className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'
						children={channel.name}
					/>
					<ul className='flex flex-col md:flex-row md:ml-6 space-x-8 items-baseline md:items-center list-disc'>
						<li className='leading-7' children={channel.nickName} />
						<li
							className='leading-7'
							children={`Підписалося ${formatNumbers(channel.subscribersCount || 0)} користувачів`}
						/>
						<li
							className='leading-7'
							children={`${channel.videosCount} відео`}
						/>
					</ul>
					<div className='flex space-x-2 items-center'>
						<span
							className='uppercase truncate max-w-xs'
							children={channel.description}
						/>
						<button
							children={<DynamicIcon name='arrow-right' />}
							onClick={() => setShowModal(true)}
						/>
					</div>
					<Button
						children={subscribed ? 'Відписатися' : 'Підписатися'}
						variant={subscribed ? 'outline' : 'default'}
						className='flex max-w-min rounded-lg'
						onClick={onSubscribeClick}
						size='sm'
					/>
				</div>
				<Dialog open={showModal} onOpenChange={setShowModal}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Про канал</DialogTitle>
						</DialogHeader>
						<div className='flex text-sm' children={channel.description} />
						<DialogTitle>Відомості про канал</DialogTitle>
						<div className='flex flex-col gap-y-3'>
							<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
								<DynamicIcon name='merge' />
								<span
									children={getChannelUrl(channel.nickName, undefined, false)}
								/>
							</div>

							<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
								<DynamicIcon name='user-check' />
								<span
									children={`Підписалося ${channel.subscribersCount} користувачів`}
								/>
							</div>

							<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
								<DynamicIcon name='monitor-play' />
								<span children={`${channel.videosCount} відео`} />
							</div>

							<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
								<DynamicIcon name='bar-chart-3' />
								<span children={`${channel.videosViewsCount} переглядів`} />
							</div>

							<div className='flex gap-x-3 items-center rounded-lg hover:bg-secondary p-2'>
								<DynamicIcon name='calendar' />
								<span
									children={`Канал створено ${new Date(channel.createdAt || '').toLocaleDateString()} р.`}
								/>
							</div>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	)
}

export default AboutChannel
