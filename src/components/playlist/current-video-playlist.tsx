import { Card, CardHeader, CardTitle, CardDescription, DynamicIcon, ScrollArea } from '@/components'
import { getChannelUrl, getVideoUrl, formatDuration, cn, getPlaylistUrl } from '@/utils'
import { IPlaylist } from '@/interfaces'
import { FC } from 'react'
import Link from 'next/link'


interface ICurrentVideoPlaylistProps {
	currVideoId: string
	currList: IPlaylist
}

const CurrentVideoPlaylist: FC<ICurrentVideoPlaylistProps> = ({ currVideoId, currList }) => {
	const currVideoIndex = currList.videos?.findIndex(value => value.id === currVideoId)

	return <Card className="w-full rounded-lg mb-3">
		<CardHeader>
			<CardTitle children={<Link href={getPlaylistUrl(currList.id, true)} children={currList.name} />} />
			<CardDescription className="flex flex-wrap items-center gap-2 py-2">
				{currList.isPrivate === true && <div
					className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center"
				>
					<DynamicIcon name="lock" className="size-4" />
					<span children="Приватний" />
				</div>}
				<div
					className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center"
				>
					<DynamicIcon name="user" className="size-4" />
					<Link href={getChannelUrl( currList.channel?.nickName! )} children={currList.channel?.name} />
				</div>
				<div
					className="bg-primary-foreground px-1.5 py-1 text-sm rounded-lg max-w-fit flex space-x-1 items-center"
					children={`${(currVideoIndex || 0) + 1}/${currList.videos?.length}`}
				/>
			</CardDescription>
		</CardHeader>
		<ScrollArea
			className="flex flex-col gap-y-3 max-h-96"
			children={
				currList.videos?.map((value, index) =>
					<div key={index}
							 className={cn('flex flex-row items-center space-x-2 hover:bg-secondary px-4 py-3', value.id === currVideoId && 'bg-secondary')}>
						<div className="hiddenOnMobile" children={value.id === currVideoId ?
							<DynamicIcon name="play" className="size-4 " /> :
							<span children={index + 1} />
						} />

						<Link
							href={getVideoUrl(value.id, undefined, currList.id, true)}
							className="relative aspect-video h-10 lg:h-16"
						>
							<img
								src={value.thumbnailUrl}
								loading="lazy"
								className="block w-full h-full object-cover aspect-video duration-200 rounded-lg"
								alt={value.id}
							/>
							<div
								className="absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded"
								children={formatDuration(value.duration)}
							/>
						</Link>
						<div className="flex flex-col gap-x-2 w-3/5">
							<Link
								href={getVideoUrl(value.id, undefined, currList.id, true)}
								className="font-bold text-base/5 line-clamp-2"
								children={value.title}
							/>
							<Link
								href={getChannelUrl(value.channel.nickName)}
								className="text-muted-foreground text-xs"
							>
								<div children={value.channel.name} />
							</Link>
						</div>
					</div>
				)}
		/>
	</Card>
}

export default CurrentVideoPlaylist
