import {
	Card,
	CardHeader,
	CardTitle,
	CardContent,
	Separator,
	buttonVariants,
	CardDescription,
	DynamicIcon
} from '@/components'
import { FC } from 'react'
import Link from 'next/link'
import { cn, formatNumbers, getDashboardVideoUrl } from '@/utils'
import { videos } from '@/data'

const DashboardLastVideosCard: FC = () => {
	return (
		<Card className='break-inside mb-2'>
			<CardHeader>
				<CardTitle>Опубліковані відео</CardTitle>
				<CardDescription>Відображено 5 завантажених відео</CardDescription>
			</CardHeader>
			<CardContent>
				<div
					className='flex flex-col gap-y-2 divide-secondary divide-y'
					children={videos.slice(0, 5).map((value, index) => (
						<div
							key={index}
							className='group flex flex-row items-center space-x-3 pt-1'
						>
							<div className='h-12 aspect-video'>
								<img
									src={value.thumbnailUrl}
									alt={value.title}
									className='size-full object-cover'
								/>
							</div>
							<div className='relative'>
								<p className='line-clamp-1' children={value.title} />
								<div className='flex flex-row space-x-4 text-muted-foreground opacity-100 group-hover:opacity-0'>
									<div className='flex items-center space-x-2 text-sm'>
										<DynamicIcon name='area-chart' className='size-4' />
										<span children={formatNumbers(value.views)} />
									</div>
									<div className='flex items-center space-x-2 text-sm'>
										<DynamicIcon
											name='message-square-more'
											className='size-4'
										/>
										<span children={formatNumbers(value.commentsCount || 0)} />
									</div>
									<div className='flex items-center space-x-2 text-sm'>
										<DynamicIcon name='thumbs-up' className='size-4' />
										<span children={formatNumbers(value.likesCount || 0)} />
									</div>
									<div className='flex items-center space-x-2 text-sm'>
										<DynamicIcon name='thumbs-down' className='size-4' />
										<span children={formatNumbers(value.disLikesCount || 0)} />
									</div>
								</div>
								<div className='absolute bg-background left-0 top-0 size-full opacity-0 group-hover:opacity-100 flex items-center space-x-4'>
									<Link
										href={getDashboardVideoUrl(value.id, 'edit')}
										className='hover:bg-muted rounded-full p-2.5'
									>
										<DynamicIcon name='pen' className='size-4' />
									</Link>
									<Link
										href={getDashboardVideoUrl(value.id, 'analytics')}
										className='hover:bg-muted rounded-full p-2.5'
									>
										<DynamicIcon name='area-chart' className='size-4' />
									</Link>
									<Link
										href={getDashboardVideoUrl(value.id, 'comments')}
										className='hover:bg-muted rounded-full p-2.5'
									>
										<DynamicIcon
											name='message-square-more'
											className='size-4'
										/>
									</Link>
								</div>
							</div>
						</div>
					))}
				/>
				<Separator className='my-2' />
				<Link
					href='/dashboard/videos'
					className={cn(
						buttonVariants({ variant: 'secondary' }),
						'text-lg hover:underline w-full'
					)}
				>
					Перейти до завантажених відео
				</Link>
			</CardContent>
		</Card>
	)
}

export default DashboardLastVideosCard
