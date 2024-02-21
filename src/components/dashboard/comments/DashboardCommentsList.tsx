import DashboardCommentCard from './DashboardCommentCard'
import { IComment } from '@/interfaces'
import { FC } from 'react'


interface IDashboardCommentsListProps {
	comments: IComment[]
	disableComment?: boolean
}

const DashboardCommentsList: FC<IDashboardCommentsListProps> = ({ comments,disableComment  }) => {

	return <div
		className="flex flex-col gap-y-1 divide-y divide-secondary border-y border-secondary"
		children={
			comments.map((value, index) =>
				<DashboardCommentCard comment={value} key={index} disableComment={disableComment} />
			)} />

}

export default DashboardCommentsList
