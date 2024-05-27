import { getUserInitials, toastError } from '@/utils'
import { NotificationsService } from '@/services'
import { INotification } from '@/interfaces'
import { FC, useState } from 'react'
import Link from 'next/link'
import {
	HoverCardTrigger,
	DynamicIcon,
	HoverCardContent,
	HoverCard,
	CardHeader,
	CardTitle,
	CardDescription,
	Avatar,
	AvatarImage,
	AvatarFallback
} from '@/components'

const HomeHeaderNotifications: FC = () => {
	const [notifications, setNotifications] = useState<INotification[]>()

	const updateData = async () => {
		try {
			const { data } = await NotificationsService.getAll()
			console.log(data)
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
				<CardHeader className='px-0 pt-0'>
					<CardTitle>Сповіщення</CardTitle>
					<CardDescription className='text-xs'>
						Сповіщення старіші за 90 днів автоматично видаляються
					</CardDescription>
				</CardHeader>
				<div
					className='grid gap-4'
					children={notifications?.map((value, index) => (
						<div key={index} className='flex items-center space-x-2.5'>
							<Avatar>
								<AvatarImage src={value.channel?.thumbnailUrl} />
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
						</div>
					))}
				/>
			</HoverCardContent>
		</HoverCard>
	)
}

export default HomeHeaderNotifications
