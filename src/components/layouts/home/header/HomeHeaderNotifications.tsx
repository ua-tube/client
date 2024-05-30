import { cn, getImageUrl, getUserInitials, toastError } from '@/utils'
import { NotificationsService } from '@/services'
import { INotification } from '@/interfaces'
import { FC, useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Button,
	buttonVariants,
	CardDescription,
	CardHeader,
	CardTitle,
	DynamicIcon,
	HoverCard,
	HoverCardContent,
	HoverCardTrigger
} from '@/components'

const HomeHeaderNotifications: FC = () => {
	const [notifications, setNotifications] = useState<INotification[]>()

	const updateData = async () => {
		try {
			const { data } = await NotificationsService.getAll()
			setNotifications(data.filter(v => v !== null))
		} catch (e) {
			toastError(e)
		}
	}

	const onDeleteNotification = async (id: string) => {
		try {
			await NotificationsService.deleteById(id)
			await updateData()
			toast.success('Сповіщення успішно видалено!')
		} catch (e) {
			toastError(e)
		}
	}

	const onDeleteAllNotification = async () => {
		try {
			await NotificationsService.deleteAll()
			toast.success('Сповіщення успішно очищено!')
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<HoverCard>
			<HoverCardTrigger asChild>
				<button
					className='rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
					onClick={updateData}
				>
					<DynamicIcon name='bell' />
				</button>
			</HoverCardTrigger>
			<HoverCardContent align='end' className='sm:min-w-80'>
				<CardHeader className={cn('px-0 pt-0', !notifications && 'pb-0')}>
					<CardTitle className='flex flex-row items-center justify-between'>
						<span>Сповіщення</span>
						{notifications && notifications.length > 0 && (
							<Button
								variant='destructive'
								size='sm'
								onClick={onDeleteAllNotification}
							>
								Видалити всі
							</Button>
						)}
					</CardTitle>
					<CardDescription className='text-xs'>
						{notifications && notifications.length > 0
							? 'Сповіщення старіші за 90 днів автоматично видаляються.'
							: 'Сповіщеннь не знайдено!'}
					</CardDescription>
				</CardHeader>
				{notifications && notifications.length > 0 && (
					<div
						className='grid gap-4'
						children={notifications?.map((value, index) => (
							<div key={index} className='flex items-center space-x-2.5'>
								<Avatar>
									<AvatarImage src={getImageUrl(value.channel?.thumbnailUrl)} />
									<AvatarFallback
										children={
											value.channel ? (
												getUserInitials(value.channel?.nickname)
											) : (
												<DynamicIcon name='settings' />
											)
										}
									/>
								</Avatar>
								<Link href={value.url}>
									{value.channel && (
										<div
											className='text-sm font-medium leading-none'
											children={`@${value.channel.nickname}`}
										/>
									)}
									<p
										className='text-xs text-muted-foreground'
										children={value.message}
									/>
								</Link>
								<button
									className={buttonVariants({
										variant: 'destructive',
										size: 'icon',
										className: 'p-1 ml-auto'
									})}
									onClick={() => onDeleteNotification(value.notificationId)}
								>
									<DynamicIcon name='x' />
								</button>
							</div>
						))}
					/>
				)}
			</HoverCardContent>
		</HoverCard>
	)
}

export default HomeHeaderNotifications
