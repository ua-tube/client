import DashboardCommentCard from './DashboardCommentCard'
import { IComment, IVideo } from '@/interfaces'
import { FC } from 'react'

interface IDashboardCommentsListProps {
	comments?: IComment[]
	video?: IVideo
	videoId: string
	disableComment?: boolean
	updateData: () => Promise<void>
}

const DashboardCommentsList: FC<
	IDashboardCommentsListProps
> = ({
			 comments,
			 disableComment,
			 video,
			 videoId,
			 updateData
		 }) => {

	return (
		<div
			className="flex flex-col gap-y-1 divide-y divide-secondary border-y border-secondary"
		>
			{comments?.map((value, index) => (
				<DashboardCommentCard
					video={video}
					videoId={videoId}
					updateData={updateData}
					comment={value}
					key={index}
					disableComment={disableComment}
				/>
			))}
		</div>
	)
}

export default DashboardCommentsList
