import { IComment, IVideo, IPagination } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { CommunityService } from '@/services'
import dynamic from 'next/dynamic'
import { toastError } from '@/utils'
import { DynamicIcon } from '@/components'
import InfiniteScroll from 'react-infinite-scroll-component'

const DashboardCommentsList = dynamic(
	() => import('../../comments/DashboardCommentsList')
)

interface IVideoCommentsTabProps {
	video?: IVideo
	videoId: string
}

const VideoCommentsTab: FC<IVideoCommentsTabProps> = ({ video, videoId }) => {
	const [params, setParams] = useState<IPagination>({ page: 1, perPage: 10 })
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [comments, setComments] = useState<IComment[]>([])

	const updateData = async (newParams?: IPagination) => {
		const currentParams = newParams || params
		try {
			const { data: newComments } = await CommunityService.getCommentsByVideo(videoId, currentParams)
			if (newComments.length <= currentParams.perPage) setHasMore(false)
			setComments((prevComments) => [...prevComments, ...newComments])
			setParams((prevParams) => ({ ...prevParams, page: +prevParams.page + 1 }))
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		(async () => {
			if (video) await updateData()
		})()
	}, [video])

	return <InfiniteScroll
		dataLength={comments.length}
		next={() => updateData()}
		hasMore={hasMore}
		loader={
			<div className="flex justify-center items-center h-20">
				<DynamicIcon name="loader" className="animate-spin" />
			</div>
		}
	>
		<DashboardCommentsList
			comments={comments}
			video={video}
			disableComment
			updateData={updateData}
			videoId={videoId}
		/>
	</InfiniteScroll>

}

export default VideoCommentsTab
