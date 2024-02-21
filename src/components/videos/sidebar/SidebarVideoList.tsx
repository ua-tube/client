import SidebarVideoCard from './SidebarVideoCard'
import { IVideo } from '@/interfaces'
import { FC } from 'react'


interface ISidebarVideoListProps {
	videos: IVideo[]
}


const SidebarVideoList: FC<ISidebarVideoListProps> = ({ videos }) => {
	return <div
		className="flex flex-col gap-y-2"
		children={videos.map((value, index) =>
			<SidebarVideoCard key={index} {...value} />
		)}
	/>

}

export default SidebarVideoList
