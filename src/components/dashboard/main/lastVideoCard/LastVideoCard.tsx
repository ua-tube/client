import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
	buttonVariants,
	DynamicIcon
} from '@/components'
import { formatNumbers, cn, getDashboardVideoUrl } from '@/utils'
import { videos } from '@/data'
import Link from 'next/link'
import { FC } from 'react'

const DashboardLastVideoCard: FC = () => {
	const video = videos[0]

	return (
		<Card className='break-inside mb-2'>
			<CardHeader>
				<CardTitle>Ефективність останнього короткого відео</CardTitle>
			</CardHeader>
			<CardContent>
				<Link
					href={getDashboardVideoUrl(video.id, 'analytics')}
					className='relative aspect-video'
				>
					<img
						src={video.thumbnailUrl}
						loading='lazy'
						className='block w-full h-full object-cover aspect-video duration-200 rounded-xl'
						alt={video.id}
					/>
					<h4
						className='absolute bottom-0 left-1 bg-gradient-to-t from-background text-secondary-foreground p-4 line-clamp-2'
						children={video.title}
					/>
				</Link>
				<div className='flex flex-row space-x-4 text-muted-foreground py-2'>
					<div className='flex items-center space-x-2 text-sm'>
						<DynamicIcon name='area-chart' className='size-4' />
						<span children={formatNumbers(video.views)} />
					</div>
					<div className='flex items-center space-x-2 text-sm'>
						<DynamicIcon name='message-square-more' className='size-4' />
						<span children={formatNumbers(video.commentsCount || 0)} />
					</div>
					<div className='flex items-center space-x-2 text-sm'>
						<DynamicIcon name='thumbs-up' className='size-4' />
						<span children={formatNumbers(video.likesCount || 0)} />
					</div>
					<div className='flex items-center space-x-2 text-sm'>
						<DynamicIcon name='thumbs-down' className='size-4' />
						<span children={formatNumbers(video.disLikesCount || 0)} />
					</div>
				</div>
				<Separator className='my-2' />
				<Link
					href={getDashboardVideoUrl(video.id, 'analytics')}
					className={cn(
						buttonVariants({ variant: 'secondary' }),
						'text-lg hover:underline w-full'
					)}
				>
					Перейти до аналітики
				</Link>
				<Link
					href={getDashboardVideoUrl(video.id, 'comments')}
					className={cn(
						buttonVariants({ variant: 'secondary' }),
						'text-lg hover:underline w-full mt-1'
					)}
				>
					Переглянути коментарі ({video.commentsCount || 0})
				</Link>
			</CardContent>
		</Card>
	)
}

export default DashboardLastVideoCard
