import {
	buttonVariants,
	DynamicIcon,
	Input,
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components'
import { cn, getImageUrl, getVideoUrl } from '@/utils'
import { FC, useEffect, useState } from 'react'
import { IVideo, UseState } from '@/interfaces'
import { useTranslation } from 'next-i18next'
import { VideoService } from '@/services'
import { useRouter } from 'next/router'
import { useDebounce } from '@/hooks'
import Link from 'next/link'

interface IHomeHeaderSearchProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const HomeHeaderSearch: FC<IHomeHeaderSearchProps> = ({
	showFullWidthSearch,
	setShowFullWidthSearch
}) => {
	const { t } = useTranslation('general')
	const { push } = useRouter()

	const [search, setSearch] = useState<string>('')
	const [searchedVideos, setSearchedVideos] = useState<IVideo[]>([])
	const searchDebounced = useDebounce(search, 500)
	const onSearch = async () => await push(`/search?query=${search}`)

	useEffect(() => {
		;(async () => {
			if (search.length > 0) {
				const { data } = await VideoService.getSearchVideos({
					page: 1,
					perPage: 32,
					q: search
				})
				setSearchedVideos(data.hits)
			} else setSearchedVideos([])
		})()
	}, [searchDebounced])

	return (
		<div
			className={`gap-4 flex-grow justify-center ${showFullWidthSearch ? 'flex' : 'hidden md:flex'}`}
		>
			{showFullWidthSearch && (
				<button
					onClick={() => setShowFullWidthSearch(false)}
					className='flex-shrink-0 rounded-lg size-10 flex items-center justify-center p-2.5'
				>
					<DynamicIcon name='arrow-left' />
				</button>
			)}

			<div
				className='flex flex-grow max-w-[600px]'
				onAbort={() => setSearchedVideos([])}
			>
				<Popover open={searchedVideos.length > 0}>
					<PopoverTrigger asChild>
						<Input
							type='search'
							value={search}
							placeholder={`${t('search')}...`}
							onChange={e => setSearch(e.target.value)}
							className='rounded-l-lg rounded-r-none py-1 px-4 text-lg focus-visible:ring-1'
						/>
					</PopoverTrigger>
					<PopoverContent
						className='p-1 max-h-[60vh] min-w-max rounded-lg overflow-y-auto'
						align='start'
						children={
							<div
								className='flex flex-col gap-y-2'
								children={searchedVideos.map((value, index) => (
									<Link
										key={index}
										onClick={() => setSearchedVideos([])}
										href={getVideoUrl(value.id, undefined, undefined, true)}
										className={cn(
											buttonVariants({ variant: 'outline' }),
											'flex flex-row justify-start p-2 max-w-[80vw]'
										)}
									>
										<div className='h-10 aspect-video w-auto p-1'>
											<img
												className='size-full object-cover'
												src={getImageUrl(value.thumbnailUrl)}
												alt={`img-${value.id}`}
											/>
										</div>
										<div className='-space-y-1 sm:w-auto w-[80vw]'>
											<p
												children={value.title}
												className='line-clamp-2 truncate text-sm text-primary'
											/>
											<span
												children={value.creator?.nickname}
												className='text-xs text-muted-foreground'
											/>
										</div>
									</Link>
								))}
							/>
						}
					/>
				</Popover>
				<button
					onClick={onSearch}
					disabled={search.trim().length === 0}
					className='py-1.5 px-4 rounded-r-lg border-input border border-l-0 flex-shrink-0 hover:bg-primary hover:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed'
				>
					<DynamicIcon name='search' />
				</button>
			</div>
		</div>
	)
}

export default HomeHeaderSearch
