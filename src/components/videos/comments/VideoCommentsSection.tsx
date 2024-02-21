import { IComment } from '@/interfaces'
import dynamic from 'next/dynamic'
import { FC } from 'react'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea
} from '@/components'

const VideoCommentsList = dynamic(()=> import('./VideoCommentsList'))

interface IVideoCommentsSectionProps {
	totalCount: number
	comments: IComment[]
}

const VideoCommentsSection: FC<IVideoCommentsSectionProps> = ({ comments, totalCount }) => {
	return <div className="flex flex-col gap-y-4">
		<div className="flex flex-row items-center justify-between">
			<h5 className="font-bold text-xl md:text-2xl" children={`${totalCount} коментірів`} />
			<Select>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Сортування" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="popular">Популярні</SelectItem>
					<SelectItem value="new">Найновіші</SelectItem>
					<SelectItem value="old">Найстаріші</SelectItem>
				</SelectContent>
			</Select>
		</div>
		<div className="flex flex-row gap-x-3">
			<Avatar>
				<AvatarImage
					src="https://yt3.ggpht.com/3UlOpvyUDI7scVr98vVbCAVr-VQVEdJOXMDigVfsi_UxQavS0gnN4EOZGBbG6gHygGbn1CbVmQ=s48-c-k-c0x00ffffff-no-rj" />
				<AvatarFallback children="SB" />
			</Avatar>
			<Textarea placeholder="Напишіть ваш коментар..." />
		</div>
		<VideoCommentsList comments={comments} />
	</div>


}

export default VideoCommentsSection
