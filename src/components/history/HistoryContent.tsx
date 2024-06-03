import { DynamicIcon, Card, CardContent, Button, CardHeader, CardTitle } from '@/components'
import { IVideo, IPagination, UseState } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { HistoryService } from '@/services'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { getVideoUrl, getChannelUrl, formatNumbers, formatTimeAgo, getImageUrl, toastError, groupByDate } from '@/utils'

const ShareVideoModal = dynamic(() => import('@/components/modals/ShareVideoModal'))

interface IViewsHistory {
	date: string
	videos: IVideo[]
}


interface IHistoryContentProps {
	value: IVideo
	setShareVideo: UseState<IVideo | undefined>
	onVideoDelete: (v: string) => Promise<void>
}


const HistoryVideo: FC<IHistoryContentProps> = ({ value, setShareVideo, onVideoDelete }) => {
	const [hovered, setHovered] = useState<boolean>(false)

	return <div
		className="flex flex-row items-start space-x-4 w-full hover:bg-primary-foreground p-2 rounded-lg group/item"
		onMouseEnter={() => setHovered(true)}
		onMouseLeave={() => setHovered(false)}
	>
		<Link
			href={getVideoUrl(value._id, undefined, undefined, true)}
			className="relative aspect-video h-32"
		>
			<img
				src={getImageUrl(hovered ? value.previewThumbnailUrl : value.thumbnailUrl)}
				loading="lazy"
				className="block w-full h-full object-cover aspect-video duration-200 rounded-xl"
				alt={value._id}
			/>
		</Link>
		<div className="flex flex-col gap-y-1 w-3/5">
			<Link
				href={getVideoUrl(
					value._id,
					undefined,
					undefined,
					true
				)}
				className="font-semibold text-xl/6 line-clamp-2"
				children={value.title}
			/>
			<Link
				href={getChannelUrl(value.creator?.nickname)}
				className="text-muted-foreground text-base/2"
				children={value.creator?.displayName}
			/>

			<div
				className="text-muted-foreground text-sm"
				children={`${formatNumbers(value.metrics?.viewsCount)} переглядів • ${formatTimeAgo(value.createdAt)}`}
			/>
		</div>
		<div className="flex flex-col md:flex-row gap-1">
			<Button
				size="sm"
				variant="outline"
				onClick={() => onVideoDelete(value._id!)}
				className="opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
				children={<DynamicIcon name="x" />}
			/>
			<Button
				size="sm"
				variant="outline"
				onClick={() => setShareVideo(value)}
				className="opacity-0 rounded-full max-w-fit group-hover/item:opacity-100"
				children={<DynamicIcon name="share" />}
			/>
		</div>
	</div>
}


const HistoryContent: FC = () => {
	const [history, setHistory] = useState<IViewsHistory[]>([])
	const [pagination, setPagination] = useState<IPagination>({
		page: 1,
		perPage: 20
	})
	const [{ recordWatchHistoryEnabled }, setHistorySettings] = useState<{
		recordWatchHistoryEnabled: boolean
	}>({ recordWatchHistoryEnabled: false })

	const [shareVideo, setShareVideo] = useState<IVideo>()

	const updateData = async (params?: IPagination) => {
		try {
			const { data } = await HistoryService.getAllHistory(params || pagination)
			setHistory(groupByDate(data.hits))
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		(async () => updateData())()
	}, [pagination])


	const onVideoDelete = async (id: string) => {
		try {
			const updatedHistory = history.map(history =>
				({ ...history, videos: history.videos.filter(video => video._id !== id) }))
			setHistory(updatedHistory.filter(history => history.videos.length > 0))
			await HistoryService.deleteHistoryRecord(id)
		} catch (e) {
			toastError(e)
		}
	}

	const onClearHistory = async () => {
		try {
			await HistoryService.deleteAllHistory()
			setHistory([])
		} catch (e) {
			toastError(e)
		}
	}

	const onPauseOrResumeHistoryRecord = async () => {
		try {
			await HistoryService.switchHistoryMode(!recordWatchHistoryEnabled)
			setHistorySettings(p =>
				({ recordWatchHistoryEnabled: !recordWatchHistoryEnabled })
			)
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		(async () => {
			const { data: settings } = await HistoryService.getHistorySettings()
			setHistorySettings(settings)
		})()
	}, [])

	return (
		<section className="mx-auto max-w-[90rem] flex flex-col gap-6 lg:gap-8 md:flex-row mt-2">
			<div className="space-y-10 w-full lg:w-3/4">
				<h1
					className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
					children="Історія пареглядів"
				/>
				<ShareVideoModal
					open={!!shareVideo}
					setOpen={() => setShareVideo(undefined)}
					video={shareVideo}
				/>
				{history.length > 0 ? (
					<div
						className="space-y-3"
						children={history.map((group, index) => (
							<div key={index}>
								<h2
									className="scroll-m-20 border-b pb-2 px-2 mb-4 text-3xl font-semibold tracking-tight first:mt-0 sticky top-14 rounded-b-lg bg-background/50 backdrop-blur-lg z-10"
									children={formatTimeAgo(group.date)}
								/>
								<div
									className="flex flex-col gap-y-2"
									children={group.videos.map((value, key) => (
										<HistoryVideo {...{ value, key, onVideoDelete, setShareVideo }} />))}
								/>
							</div>
						))}
					/>
				) : (
					<div className="mx-auto flex items-center space-x-2">
						<p className="leading-7 space-x-1">
							<span children="Історія переглядів пуста, " />
							<Link
								href="/"
								className="font-medium text-primary underline underline-offset-4"
							>
								перейти на головну сторінку
							</Link>
						</p>
					</div>
				)}
			</div>
			<Card className="w-full lg:w-1/4 h-fit rounded-xl lg:sticky lg:top-20 bg-repeat-space bg-center bg-cover">
				<CardHeader>
					<CardTitle children="Керування історією" />
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Button
							className="flex items-center space-x-2 w-full"
							variant="outline"
							onClick={onClearHistory}
						>
							<DynamicIcon name="trash" />
							<span>Очистити історію</span>
						</Button>
						<Button
							className="flex items-center space-x-2 w-full"
							variant="outline"
							onClick={onPauseOrResumeHistoryRecord}
						>
							<DynamicIcon name={recordWatchHistoryEnabled ? 'pause' : 'play'} />
							<span>{recordWatchHistoryEnabled ? 'Зупинити' : 'Відновити'} запис історії перегляду</span>
						</Button>
					</div>
				</CardContent>
			</Card>
		</section>
	)
}

export default HistoryContent
