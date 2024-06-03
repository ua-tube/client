import { GetServerSideProps, InferGetServerSidePropsType } from 'next'
import AboutChannel from '@/components/channel/AboutChannel'
import { CreatorService, LibraryService } from '@/services'
import { ICreator, IVideo } from '@/interfaces'
import { getChannelUrl, toastError } from '@/utils'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AppHead, buttonVariants, CategoryPills, HomeLayout, VideosList, DynamicIcon } from '@/components'
import { useEffect, useState, useRef } from 'react'

type SortType = 'new' | 'views' | 'popular'

const sortOptions: { sortBy: SortType; title: string }[] = [
	{ sortBy: 'new', title: 'Найновіші' },
	{ sortBy: 'views', title: 'Популярні' },
	{ sortBy: 'popular', title: 'Найбільш уподобані' }
]

const getSortData = (type: SortType) => {
	switch (type) {
		case 'popular':
			return {
				sortOrder: 'asc',
				sortBy: 'likesCount'
			}
		case 'new':
			return {
				sortOrder: 'asc',
				sortBy: 'createdAt'
			}
		case 'views':
			return {
				sortOrder: 'asc',
				sortBy: 'viewsCount'
			}
		default:
			return undefined
	}
}

export const getServerSideProps: GetServerSideProps<{
	creator: ICreator
	videos: IVideo[]
	sort: SortType
}> = async ({ query }) => {
	const nickname = (query?.nickname as string) || ''
	const sort = (query?.sortBy as SortType) || 'new'
	const sortOptions = getSortData(sort)
	try {
		const { data: creator } = await CreatorService.getCreatorByNicknameOrUserId(
			{ nickname }
		)
		const { data: videos } = await LibraryService.getVideos({
			creatorId: creator.id,
			page: 1,
			perPage: 10,
			...(sortOptions && sortOptions)
		})

		return { props: { creator, videos, sort } }
	} catch (e) {
		return {
			redirect: {
				permanent: true,
				destination: `/404?message=${encodeURIComponent('Канал більше не доступний')}`
			}
		}
	}
}

export default function ChannelVideosPage({
																						creator,
																						videos,
																						sort
																					}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const { pathname, push, query } = useRouter()
	const currOption = sortOptions.find(v => v.sortBy == sort)

	const observerTarget = useRef<HTMLDivElement>(null)
	const [page, setPage] = useState(2)
	const [currVideos, setCurrVideos] = useState<IVideo[]>(videos || [])
	const [loading, setLoading] = useState<boolean>(false)

	const updateData = async () => {
		try {
			setLoading(true)
			const sort = (query?.sortBy as SortType) || 'new'
			const sortOptions = getSortData(sort)
			const { data: newVideos } = await LibraryService.getVideos({
				creatorId: creator.id,
				page,
				perPage: 10,
				...(sortOptions && sortOptions)
			})
			setCurrVideos(p => [...p, ...newVideos])
			setPage(p => p + 1)
		} catch (e) {
			toastError(e)
		} finally {
			setLoading(false)
		}
	}


	useEffect(() => {
		const observer = new IntersectionObserver(
			entries => {
				if (entries[0].isIntersecting) (async () => updateData())()
			},
			{ threshold: 1 }
		)

		if (observerTarget.current) observer.observe(observerTarget.current)

		return () => {
			if (observerTarget.current) observer.unobserve(observerTarget.current)
		}
	}, [observerTarget])


	return (
		<>
			<AppHead title={`Відео ${creator.displayName}`} />
			<HomeLayout autoShowSidebar openInDrawer>
				<div className="max-w-7xl mx-auto flex flex-col gap-y-5">
					<AboutChannel creator={creator} />
					<div
						className="space-x-3 border-accent border-b pb-2"
						children={[
							{ key: 'videos', title: 'Відео' },
							{ key: 'playlists', title: 'Плейлісти' }
						]?.map((value, index) => (
							<Link
								key={index}
								children={value.title}
								href={getChannelUrl(creator.nickname, value.key, true)}
								className={buttonVariants({
									variant: value.key === 'videos' ? 'secondary' : 'outline'
								})}
							/>
						))}
					/>
					<CategoryPills
						data={sortOptions.map(v => v.title)}
						value={currOption?.title}
						onChange={async s => {
							const sort = sortOptions.find(v => v.title === s)?.sortBy
							await push({
								query: {
									nickname: creator.nickname,
									...(sort && { sort })
								},
								pathname
							})
						}}
					/>
					<VideosList videos={currVideos} />
					{loading && <div className="flex items-center justify-center h-10">
						<DynamicIcon name="loader"
												 className="animate-spin" />
					</div>}

					<div ref={observerTarget} />
				</div>
			</HomeLayout>
		</>
	)
}
