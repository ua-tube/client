import {
	getVideoUrl,
	getChannelUrl,
	formatDuration,
	formatTimeAgo,
	formatNumbers
} from '@/utils'
import { DynamicIcon, CategoryPills } from '@/components'
import { IPlaylist } from '@/interfaces'
import Link from 'next/link'
import { FC } from 'react'

interface IPlaylistContentProps {
	list: IPlaylist
}

const PlaylistContent: FC<IPlaylistContentProps> = ({ list }) => {
	return (
		<section className='mx-auto flex flex-col-reverse gap-6 lg:gap-8 md:flex-row'>
			<div className='w-full lg:w-3/4 space-y-1'>
				<CategoryPills
					categories={['Спочатку новіші', 'Спочатку старіші', 'Найпопулярніші']}
				/>

				<div
					className='flex flex-col gap-y-2'
					children={list.videos?.map((value, index) => (
						<div
							key={index}
							className='flex flex-row items-center space-x-2 w-full hover:bg-primary-foreground p-2 rounded-lg'
						>
							<span children={index + 1} />
							<Link
								href={getVideoUrl(value.id, undefined, list.id, true)}
								className='relative aspect-video h-24'
							>
								<img
									src={value.thumbnailUrl}
									loading='lazy'
									className='block w-full h-full object-cover aspect-video duration-200 rounded-xl'
									alt={value.id}
								/>
								<div
									className='absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded'
									children={formatDuration(value.lengthSeconds)}
								/>
							</Link>
							<div className='flex flex-col gap-y-1 w-3/5'>
								<Link
									href={getVideoUrl(value.id, undefined, list.id, true)}
									className='font-semibold text-lg/4 line-clamp-2'
									children={value.title}
								/>
								<Link
									href={getChannelUrl(value.creator.nickName)}
									className='text-muted-foreground text-sm'
									children={value.creator.name}
								/>

								<div
									className='text-muted-foreground text-xs'
									children={`${formatNumbers(value.views)} переглядів • ${formatTimeAgo(value.postedAt)}`}
								/>
							</div>
						</div>
					))}
				/>
			</div>
			<div
				className='w-full lg:w-1/4 h-fit rounded-xl lg:sticky lg:top-0 bg-repeat-space bg-center bg-cover'
				style={{ backgroundImage: `url(${list.imgUrl})` }}
			>
				<div className='flex flex-col w-full h-full backdrop-blur-lg rounded-xl p-6'>
					<Link
						className='w-full h-40 aspect-video relative group'
						href={getVideoUrl(list.id, undefined)}
					>
						<img
							className='block w-full h-full object-cover rounded-lg'
							src={list.imgUrl}
							alt='playlist-img'
						/>
						<div className='absolute top-0 w-full h-full bg-background opacity-0 group-hover:opacity-80 transition duration-300 flex justify-center items-center rounded-lg space-x-2'>
							<DynamicIcon name='list-video' />
							<Link
								href={getVideoUrl(
									list.videos?.[0].id,
									undefined,
									list.id,
									true
								)}
								children='Дивитися весь плейліст'
							/>
						</div>
					</Link>
					<div className='flex flex-col gap-y-3 py-3'>
						<h3
							className='scroll-m-20 text-3xl font-bold tracking-tight line-clamp-3'
							children={list.name}
						/>
						<div className='space-y-2'>
							<div className='flex items-center space-x-2'>
								<DynamicIcon name='user' />
								<span>Створив: </span>
								<Link
									className='leading-7 font-semibold'
									href={getChannelUrl(list.channel?.nickName)}
									children={list.channel?.name}
								/>
							</div>
							{list.viewsCount && (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='eye' />
									<span>Переглянуто: </span>
									<div
										className='leading-7 font-semibold'
										children={`${formatNumbers(list.viewsCount || 0)} разів`}
									/>
								</div>
							)}
							<div className='flex items-center space-x-2'>
								<DynamicIcon name='list-video' />
								<span>Налічує: </span>
								<div
									className='leading-7 font-semibold'
									children={`${list.videosCount} відео`}
								/>
							</div>
							{list.createdAt && (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='calendar-check' />
									<span>Створено: </span>
									<div
										className='leading-7 font-semibold'
										children={formatTimeAgo(list.createdAt)}
									/>
								</div>
							)}
							{list.updatedAt && (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='calendar-check-2' />
									<span>Оновлено: </span>
									<div
										className='leading-7 font-semibold'
										children={formatTimeAgo(list.updatedAt)}
									/>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}

export default PlaylistContent
