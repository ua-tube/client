import { DynamicIcon, Input, Popover, PopoverTrigger, PopoverContent, buttonVariants } from '@/components'
import { UseState, IVideo } from '@/interfaces'
import { useRouter } from 'next/router'
import { FC, useState, useEffect } from 'react'
import { useDebounce } from '@/hooks'
import { videos } from '@/data'
import { cn, getVideoUrl } from '@/utils'
import Link from 'next/link'

interface IHomeHeaderSearchProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const HomeHeaderSearch: FC<IHomeHeaderSearchProps> = ({ showFullWidthSearch, setShowFullWidthSearch }) => {
	const [search, setSearch] = useState<string>('')
	const [searchedVideos, setSearchedVideos] = useState<IVideo[]>([])
	const searchDebounced = useDebounce(search, 500)
	const { push } = useRouter()
	const onSearch = async () => await push(`/search?query=${search}`)

	useEffect(() =>
			search.length > 0 ?
				setSearchedVideos(videos.filter(v => v.title.includes(search)))
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
						placeholder="Пошук"
						onChange={(e) => setSearch(e.target.value)}
						className="rounded-l-lg rounded-r-none py-1 px-4 text-lg focus-visible:ring-1"
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
								href={getVideoUrl(value.id, undefined, undefined, true)}
								className={cn(
									buttonVariants({ variant: 'outline' }),
									'flex flex-row justify-start p-2'
								)}>
								<div className="h-10 aspect-video w-auto p-1">
									<img
										className="size-full object-cover"
										src={value.thumbnailUrl}
										alt={`img-${value.id}`}
									/>
								</div>
								<div className="-space-y-1">
									<p children={value.title} className="line-clamp-1 text-sm text-primary" />
									<span children={value.channel.nickName} className="text-xs text-muted-foreground" />
								</div>
							</Link>
						)} />
					} />
			</Popover>
			<button
				onClick={onSearch}
				className="py-1.5 px-4 rounded-r-lg border-input border border-l-0 flex-shrink-0 hover:bg-primary hover:text-primary-foreground"
			>
				<DynamicIcon name="search" />
			</button>
		</div>
	</div>

}

export default HomeHeaderSearch
