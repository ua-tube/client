import { Card, CardDescription, CardHeader, CardTitle, DynamicIcon, ScrollArea } from '@/components'
import { cn, formatDuration, getChannelUrl, getImageUrl, getPlaylistUrl, getVideoUrl } from '@/utils'
import { IPlaylist } from '@/interfaces'
import { useRouter } from 'next/router'
import { useAuth } from '@/hooks'
import Link from 'next/link'
import { FC } from 'react'

interface ICurrentVideoPlaylistProps {
	currVideoId: string
	currList: IPlaylist
}

const CurrentVideoPlaylist: FC<
	ICurrentVideoPlaylistProps
> = ({
			 currVideoId,
			 currList
		 }) => {
	const { query: { listId } } = useRouter()
	const { user } = useAuth()
	const currVideoIndex = currList.videos?.list.findIndex(value => value.id === currVideoId)
	const currPlaylistId = (listId === 'LL' || listId === 'WL') ? listId : currList?.id

	return (
		<Card className="w-full rounded-lg mb-3">
			<CardHeader>
				<CardTitle
					children={
						<Link
							href={getPlaylistUrl(currList.id, true)}
							children={currList.title}
						/>
					}
				/>
				<CardDescription className="flex flex-wrap items-center gap-2 py-2">
					{currList.visibility !== 'Public' && (
						<div className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center">
							<DynamicIcon name="lock" className="size-4" />
							<span children="Приватний" />
						</div>
					)}
					<div className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center">
						<DynamicIcon name="user" className="size-4" />
						<Link
							href={getChannelUrl(currPlaylistId?.length < 3 ? user?.creator.nickname : currList.creator?.nickname)}
							children={currPlaylistId?.length < 3 ? user?.creator.displayName : currList.creator?.displayName}
						/>
					</div>
					<div
						className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center"
						children={`${(currVideoIndex || 0) + 1}/${currList.metrics?.itemsCount}`}
					/>
				</CardDescription>
			</CardHeader>
			<ScrollArea
				className="flex flex-col gap-y-3 max-h-96"
				children={currList.videos?.list.map((value, index) => (
					<div
						key={index}
						className={cn(
							'flex flex-row items-center space-x-2 hover:bg-secondary px-4 py-3',
							value.id === currVideoId && 'bg-secondary'
						)}
					>
						<div
							className="hiddenOnMobile"
							children={
								value.id === currVideoId ? (
									<DynamicIcon name="play" className="size-4 " />
								) : (
									<span children={index + 1} />
								)
							}
						/>

						<Link
							href={getVideoUrl(value.id, undefined, currPlaylistId, true)}
							className="relative aspect-video h-10 lg:h-16"
						>
							<img
								src={getImageUrl(value.thumbnailUrl)}
								loading="lazy"
								className="block w-full h-full object-cover aspect-video duration-200 rounded-lg"
								alt={value.id}
							/>
							<div
								className="absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded"
								children={formatDuration(value.lengthSeconds)}
							/>
						</Link>
						<div className="flex flex-col gap-x-2 w-3/5">
							<Link
								href={getVideoUrl(value.id, undefined, currPlaylistId, true)}
								className="font-bold text-base/5 line-clamp-2"
								children={value.title}
							/>
							<Link
								href={getChannelUrl(value.creator?.nickname)}
								className="text-muted-foreground text-xs"
							>
								<div children={value.creator?.displayName} />
							</Link>
						</div>
					</div>
				))}
			/>
		</Card>
	)
}

export default CurrentVideoPlaylist
