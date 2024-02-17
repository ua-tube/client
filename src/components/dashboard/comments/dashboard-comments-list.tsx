import DashboardCommentCard from './dashboard-comment-card'
import { IComment } from '@/interfaces'
import { FC } from 'react'


interface IDashboardCommentsListProps {
	comments: IComment[]
}

const DashboardCommentsList: FC<IDashboardCommentsListProps> = ({ comments }) => {

	return <div
		className="flex flex-col gap-y-1 divide-y divide-secondary border-y border-secondary"
		children={
			comments.map((value, index) =>
				<DashboardCommentCard comment={value} key={index} />
			)} />

}

export default DashboardCommentsList
