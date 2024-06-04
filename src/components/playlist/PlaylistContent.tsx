import { useTranslation } from 'next-i18next'
import { DynamicIcon } from '@/components'
import { IPlaylist } from '@/interfaces'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks'
import Link from 'next/link'
import { FC } from 'react'
import {
	formatDuration,
	formatNumbers,
	formatTimeAgo,
	getChannelUrl,
	getImageUrl,
	getVideoUrl
} from '@/utils'

interface IPlaylistContentProps {
	playlist?: IPlaylist
	listId: string
}

const PlaylistContent: FC<IPlaylistContentProps> = ({ playlist, listId }) => {
	const { user } = useAuth()
	const { locale } = useRouter()
	const { t } = useTranslation('playlist')

	const firstVideo = playlist?.videos?.list?.[0]
	const currPlaylistId =
		listId === 'LL' || listId === 'WL' ? listId : playlist?.id

	return (
		<section className='mx-auto flex flex-col-reverse gap-6 lg:gap-8 md:flex-row'>
			<div className='w-full lg:w-3/4 space-y-1'>
				<div className='flex flex-col gap-y-2'>
					{playlist?.videos?.list?.map((value, index) => (
						<div
							key={index}
							className='flex flex-row items-center space-x-2 w-full hover:bg-primary-foreground p-2 rounded-lg'
						>
							<span children={index + 1} />
							<Link
								href={getVideoUrl(value.id, undefined, currPlaylistId, true)}
								className='relative aspect-video h-24'
							>
								<img
									src={getImageUrl(value.thumbnailUrl)}
									loading='lazy'
									className='block w-full h-full object-cover aspect-video duration-200 rounded-xl'
									alt={value.id}
								/>
								<div
									className='absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded'
									children={formatDuration(value.lengthSeconds, locale)}
								/>
							</Link>
							<div className='flex flex-col gap-y-1 w-3/5'>
								<Link
									href={getVideoUrl(value.id, undefined, currPlaylistId, true)}
									className='font-semibold text-lg/4 line-clamp-2'
									children={value.title}
								/>
								<Link
									href={getChannelUrl(value.creator?.nickname)}
									className='text-muted-foreground text-sm'
									children={value.creator?.displayName}
								/>

								<div
									className='text-muted-foreground text-xs'
									children={`${formatNumbers(value.metrics?.viewsCount, locale)} ${t('views')} • ${formatTimeAgo(value.createdAt, locale)}`}
								/>
							</div>
						</div>
					))}
				</div>
			</div>
			<div
				className='w-full lg:w-1/4 h-fit rounded-xl lg:sticky lg:top-0 bg-repeat-space bg-center bg-cover'
				style={{
					backgroundImage: `url(${getImageUrl(firstVideo?.thumbnailUrl)})`
				}}
			>
				<div className='flex flex-col w-full h-full backdrop-blur-lg rounded-xl p-6'>
					<Link
						className='w-full h-40 aspect-video relative group'
						href={getVideoUrl(firstVideo?.id, undefined, currPlaylistId, true)}
					>
						<img
							className='block w-full h-full object-cover rounded-lg'
							src={getImageUrl(firstVideo?.thumbnailUrl)}
							alt='playlist-img'
						/>
						<div className='absolute top-0 w-full h-full bg-background opacity-0 group-hover:opacity-80 transition duration-300 flex justify-center items-center rounded-lg space-x-2'>
							<DynamicIcon name='list-video' />
							<Link
								href={getVideoUrl(
									firstVideo?.id,
									undefined,
									currPlaylistId,
									true
								)}
								children={t('showAllVideos')}
							/>
						</div>
					</Link>
					<div className='flex flex-col gap-y-3 p-3 rounded-lg bg-background/10 mt-2'>
						<h3
							className='scroll-m-20 text-3xl font-bold tracking-tight line-clamp-3'
							children={t(playlist?.title || 'playlist')}
						/>
						<div className='space-y-2'>
							<div className='flex items-center space-x-2'>
								<DynamicIcon name='user' />
								<span>{t('creator')}: </span>
								<Link
									className='leading-7 font-semibold'
									href={getChannelUrl(
										playlist?.creator?.nickname || user?.creator.nickname
									)}
									children={
										playlist?.creator?.displayName || user?.creator.displayName
									}
								/>
							</div>
							{typeof playlist?.metrics?.viewsCount !== 'undefined' &&
							+playlist?.metrics?.viewsCount > 0 ? (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='eye' />
									<span>{t('viewed')}: </span>
									<div
										className='leading-7 font-semibold'
										children={`${formatNumbers(playlist.metrics?.viewsCount, locale)} ${t('times')}`}
									/>
								</div>
							) : null}
							<div className='flex items-center space-x-2'>
								<DynamicIcon name='list-video' />
								<span>{t('timesFound')}: </span>
								<div
									className='leading-7 font-semibold'
									children={`${playlist?.metrics?.itemsCount} `}
								/>
							</div>
							{(playlist?.createdAt || user?.creator.createdAt) && (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='calendar-check' />
									<span>Створено: </span>
									<div
										className='leading-7 font-semibold'
										children={formatTimeAgo(
											playlist?.createdAt || user?.creator.createdAt,
											locale
										)}
									/>
								</div>
							)}
							{playlist?.updatedAt && (
								<div className='flex items-center space-x-2'>
									<DynamicIcon name='calendar-check-2' />
									<span>Оновлено: </span>
									<div
										className='leading-7 font-semibold'
										children={formatTimeAgo(playlist.updatedAt, locale)}
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
