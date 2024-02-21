import { IVideo } from '@/interfaces'
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
import { CategoryPills, Button, DynamicIcon } from '@/components'

const SearchVideoCard = dynamic(() => import( './SearchVideoCard'))
const FiltersModal = dynamic(() => import( './FiltersModal'))
const PlaylistsModal = dynamic(() => import( '@/components/modals/PlaylistsModal'))
const ReportModal = dynamic(() => import( '@/components/modals/ReportVideoModal'))
const ShareModal = dynamic(() => import( '@/components/modals/ShareVideoModal'))

export type VideoModalType = 'playlists' | 'report' | 'share'

interface ISearchContentProps {
	videos: IVideo[]
}

const SearchContent: FC<ISearchContentProps> = ({ videos }) => {
	const [videoModal, setVideoModal] = useState<{ video: IVideo, type: VideoModalType }>()
	const [showFilters, setShowFilters] = useState<boolean>(false)

	return <div className="mx-auto max-w-5xl">

		<div className="flex flex-col lg:flex-row gap-3 lg:justify-between items-center py-2">
			<CategoryPills categories={['Усі', 'Відео', 'Неперелянуті', 'Ви дивилися', 'Нещодавно завантажені']} />
			<Button variant="secondary" size="sm" onClick={() => setShowFilters(p => !p)}>
				<DynamicIcon name="filter" className="size-4" />
				<span>Фільтри</span>
			</Button>
		</div>


		<div className="flex flex-col gap-y-3" children={
			videos.map((value, index) =>
				<SearchVideoCard key={index} value={value} setModal={setVideoModal} />
			)} />

		<FiltersModal setOpen={setShowFilters} open={showFilters} />

		<PlaylistsModal
			video={videoModal?.video}
			open={videoModal?.type === 'playlists'}
			setOpen={(v) => setVideoModal(undefined)}
		/>

		<ReportModal
			video={videoModal?.video}
			open={videoModal?.type === 'report'}
			setOpen={(v) => setVideoModal(undefined)}
		/>
		<ShareModal
			video={videoModal?.video}
			open={videoModal?.type === 'share'}
			setOpen={(v) => setVideoModal(undefined)}
		/>
	</div>

}

export default SearchContent
