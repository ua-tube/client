import { getImageUrl, getPlaylistUrl } from '@/utils'
import { useTranslation } from 'next-i18next'
import { DynamicIcon } from '@/components'
import { IPlaylist } from '@/interfaces'
import Link from 'next/link'
import { FC } from 'react'

interface IPlaylistCardProps {
	playList: IPlaylist
}

const PlaylistCard: FC<IPlaylistCardProps> = ({ playList }) => {
	const { t } = useTranslation('playlist')

	return (
		<div className='flex flex-col'>
			<Link
				href={getPlaylistUrl(playList.id, true)}
				className='relative aspect-video'
			>
				<img
					src={getImageUrl((playList?.videos as any)?.[0]?.video?.thumbnailUrl)}
					loading='lazy'
					className='block w-full h-full object-cover aspect-video duration-200 rounded-lg'
					alt={playList.id}
				/>
				<div className='absolute bottom-1 right-1 space-x-1 p-1 flex items-center rounded-lg bg-background/50'>
					<DynamicIcon name='list-video' />
					<div
						className='text-xs'
						children={`${playList.metrics?.itemsCount} ${t('disliked_playlist').split(',')?.[0]?.toLowerCase()}`}
					/>
				</div>
			</Link>
			<div className='py-3 space-y-2'>
				<Link
					href={getPlaylistUrl(playList.id, true)}
					className='relative aspect-video space-y-1'
				>
					<h5
						className='scroll-m-20 text-base font-semibold tracking-tight line-clamp-2'
						children={playList.title}
					/>
					<p className='text-xs' children={t('showAllVideos')} />
				</Link>

				{playList.visibility !== 'Public' && (
					<div className='bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center'>
						<DynamicIcon name='lock' className='size-4' />
						<span children={t('privateList')} />
					</div>
				)}
			</div>
		</div>
	)
}

export default PlaylistCard
