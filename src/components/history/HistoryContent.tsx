import { getVideoUrl, formatDuration, getChannelUrl, formatNumbers, formatTimeAgo, writeVideoUrl } from '@/utils'
import { DynamicIcon, Card, CardContent, Button, CardHeader, CardTitle } from '@/components'
import { IVideo } from '@/interfaces'
import { videos } from '@/data'
import Link from 'next/link'
import { FC, useState } from 'react'


interface IViewsHistory {
	date: string,
	videos: IVideo[]
}


const historyData: IViewsHistory[] = [
	{ date: new Date().toISOString(), videos: videos.slice(2, 5) },
	{ date: new Date('2024-02-06').toISOString(), videos: videos.slice(6, 12) },
	{ date: new Date('2024-02-01').toISOString(), videos: videos.slice(6, 12) },
	{ date: new Date('2024-01-01').toISOString(), videos: videos.slice(5, 9) }
]

const HistoryContent: FC = () => {
	const [currHistory, setCurrHistory] = useState<IViewsHistory[]>(historyData)

	const onVideoDelete = (id: string) => {
		const updatedHistory = currHistory.map(history => {
			const updatedVideos = history.videos.filter(video => video.id !== id)
			return { ...history, videos: updatedVideos }
		})
		setCurrHistory(updatedHistory.filter(history => history.videos.length > 0))

		// TODO: create request for video remove from history
	}

	const onClearHistory = () => {
		// TODO make request for clear history
		setCurrHistory([])
	}

	return <section className="mx-auto max-w-[90rem] flex flex-col gap-6 lg:gap-8 md:flex-row">
		<div className="space-y-10 w-full lg:w-3/4 ">
			<h1
				className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
				children="Історія пареглядів"
			/>
			{currHistory.length > 0 ?
				<div
					className="space-y-3"
					children={
						currHistory.map((value, index) =>
							<div key={index}>
								<h2 className="scroll-m-20 border-b pb-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0 sticky top-0 bg-background z-10"
										children={formatTimeAgo(value.date)} />
								<div
									className="flex flex-col gap-y-2"
									children={value.videos.map((value, index) =>
										<div
											key={index}
											className="flex flex-row items-start space-x-4 w-full hover:bg-primary-foreground p-2 rounded-lg group/item"
										>
											<Link
												href={getVideoUrl(value.id, undefined, undefined, true)}
												className="relative aspect-video h-32"
											>
												<img
													src={value.thumbnailUrl}
													loading="lazy"
													className="block w-full h-full object-cover aspect-video duration-200 rounded-xl"
													alt={value.id}
												/>
												<div
													className="absolute bottom-1 right-1 bg-background/80 text-secondary-foreground text-sm px-1 rounded"
													children={formatDuration(value.duration)}
												/>
											</Link>
											<div className="flex flex-col gap-y-1 w-3/5">
												<Link
													href={getVideoUrl(value.id, undefined, undefined, true)}
													className="font-semibold text-xl/6 line-clamp-2"
													children={value.title}
												/>
												<Link
													href={getChannelUrl(value.channel.nickName)}
													className="text-muted-foreground text-base/2"
													children={value.channel.name}
												/>

												<div
													className="text-muted-foreground text-sm"
													children={`${formatNumbers(value.views)} переглядів • ${formatTimeAgo(value.postedAt)}`}
												/>
											</div>
											<div className="space-x-2">
												<Button
													size="sm"
													variant="outline"
													onClick={() => onVideoDelete(value.id)}
													className="opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
													children={<DynamicIcon name="x" />}
												/>
												<Button
													size="sm"
													variant="outline"
													onClick={() => writeVideoUrl(value.id)}
													className="opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
													children={<DynamicIcon name="share" />}
												/>
											</div>
										</div>
									)} />
							</div>
						)}
				/>
				: <div className="mx-auto flex items-center space-x-2">
					<p className="leading-7 space-x-1">
						<span children="Історія переглядів пуста, " />
						<Link
							href="/"
							className="font-medium text-primary underline underline-offset-4"
						>
							перейти на головну сторінку
						</Link>
					</p>
				</div>}
		</div>
		<Card className="w-full lg:w-1/4 h-fit rounded-xl lg:sticky lg:top-0 bg-repeat-space bg-center bg-cover">
			<CardHeader><CardTitle children="Керування історією" /></CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Button className="flex items-center space-x-2 w-full" variant="outline" onClick={onClearHistory}>
						<DynamicIcon name="trash" />
						<span>Очистити історію</span>
					</Button>
					<Button className="flex items-center space-x-2 w-full" variant="outline">
						<DynamicIcon name="pause" />
						<span>Призупинити запис історії перегляду</span>
					</Button>
					<Button className="flex items-center space-x-2 w-full" variant="outline">
						<DynamicIcon name="settings" />
						<span>Очистити історію пошуків</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	</section>

}

export default HistoryContent
