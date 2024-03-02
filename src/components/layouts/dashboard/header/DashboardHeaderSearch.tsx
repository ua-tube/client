import {
	DynamicIcon,
	Input,
	Popover,
	PopoverTrigger,
	PopoverContent,
	buttonVariants,
	Tooltip,
	TooltipTrigger,
	TooltipContent
} from '@/components'
import { UseState, IVideo } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { cn, getDashboardVideoUrl } from '@/utils'
import { useDebounce } from '@/hooks'
import { videos } from '@/data'
import Link from 'next/link'

interface IDashboardHeaderSearchProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const DashboardHeaderSearch: FC<IDashboardHeaderSearchProps> = ({ showFullWidthSearch, setShowFullWidthSearch }) => {
	const [search, setSearch] = useState<string>('')
	const [searchedVideos, setSearchedVideos] = useState<IVideo[]>([])
	const searchDebounced = useDebounce(search, 500)

	useEffect(() =>
			search.length > 0 ?
				setSearchedVideos(videos.filter(v => v.title.includes(search.trim())))
				: undefined
		, [searchDebounced])

	return <div
		className={`gap-4 flex-grow justify-center ${showFullWidthSearch ? 'flex' : 'hidden md:flex'}`}
	>
		{showFullWidthSearch && (
			<button
				onClick={() => setShowFullWidthSearch(false)}
				className="flex-shrink-0 rounded-lg size-10 flex items-center justify-center p-2.5"
			>
				<DynamicIcon name="arrow-left" />
			</button>
		)}

		<div className="flex flex-grow max-w-[600px]" onAbort={() => setSearchedVideos([])}>
			<Popover open={searchedVideos.length > 0}>
				<PopoverTrigger asChild>
					<Input
						type="search"
						value={search}
						placeholder="Пошук по вашому каналі"
						onChange={(e) => setSearch(e.target.value)}
						className="rounded-lg py-1 px-4 text-lg focus-visible:ring-1"
					/>
				</PopoverTrigger>
				<PopoverContent
					className="p-1 max-h-[60vh] min-w-max rounded-lg overflow-y-auto"
					align="start"
					children={<div
						className="flex flex-col gap-y-2"
						children={searchedVideos.map((value, index) =>
							<Link
								key={index}
								onClick={() => setSearchedVideos([])}
								href={getDashboardVideoUrl(value.id, 'edit')}
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'flex flex-row justify-start p-2 max-w-[80vw] space-x-1 group'
								)}>
								<div className="h-10 aspect-video w-16 p-1 rounded-lg">
									<img
										className="size-full object-cover rounded-lg"
										src={value.thumbnailUrl}
										alt={`img-${value.id}`}
									/>
								</div>
								<p
									className="w-[24rem] truncate text-sm text-primary"
									children={value.title}
								/>
								<div
									className="ml-auto opacity-0 group-hover:opacity-100 flex items-center space-x-4"
								>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={getDashboardVideoUrl(value.id, 'edit')}
												className="hover:bg-primary hover:text-muted rounded-full p-2"
											>
												<DynamicIcon name="pen" className="size-4" />
											</Link>
										</TooltipTrigger>
										<TooltipContent children="Редагувати відео" />
									</Tooltip>
									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={getDashboardVideoUrl(value.id, 'analytics')}
												className="hover:bg-primary hover:text-muted rounded-full p-2"
											>
												<DynamicIcon name="area-chart" className="size-4" />
											</Link>
										</TooltipTrigger>
										<TooltipContent children="Аналітика відео" />
									</Tooltip>

									<Tooltip>
										<TooltipTrigger asChild>
											<Link
												href={getDashboardVideoUrl(value.id, 'comments')}
												className="hover:bg-primary hover:text-muted rounded-full p-2"
											>
												<DynamicIcon name="message-square-more" className="size-4" />
											</Link>
										</TooltipTrigger>
										<TooltipContent children="Перейти до коментарів" />
									</Tooltip>

								</div>
							</Link>
						)} />
					} />
			</Popover>
		</div>
	</div>

}

export default DashboardHeaderSearch
