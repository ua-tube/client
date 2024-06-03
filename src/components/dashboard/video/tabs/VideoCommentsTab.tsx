import { IComment, IVideo } from '@/interfaces'
import { FC, useState, useEffect } from 'react'
import { CommunityService } from '@/services'
import dynamic from 'next/dynamic'
import { toastError } from '@/utils'
import InfiniteScroll from 'react-infinite-scroll-component'

const DashboardCommentsList = dynamic(
	() => import('../../comments/DashboardCommentsList')
)

interface IVideoCommentsTabProps {
	video?: IVideo
	videoId: string
}

const VideoCommentsTab: FC<IVideoCommentsTabProps> = ({ video, videoId }) => {
	const [page, setPage] = useState<number>(1)
	const [hasMore, setHasMore] = useState<boolean>(true)
	const [comments, setComments] = useState<IComment[]>([])


	const updateData = async () => {
		try {
			const { data } = await CommunityService.getCommentsByVideo(videoId, { page, perPage: 10 })

			if (data.some(v => comments.some(cv => cv.id === v.id))) {
				setHasMore(false)
			} else {
				setComments(p => [...p, ...data])
				setPage(p => p + 1)
				setHasMore(true)
			}
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		;(async () => {
			if (video) await updateData()
		})()
	}, [video])

	return (
		<InfiniteScroll
			dataLength={comments.length}
			next={updateData}
			hasMore={hasMore}
			loader={<div></div>}
		>
			<DashboardCommentsList
				comments={comments}
				video={video}
				updateData={updateData}
				videoId={videoId}
			/>
		</InfiniteScroll>
	)
}

export default VideoCommentsTab
