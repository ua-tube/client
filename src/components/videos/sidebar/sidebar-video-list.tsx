import { videos } from '@/data'
import { FC } from 'react'
import SidebarVideoCard from './sidebar-video-card'

const SidebarVideoList: FC = () => {

	return <div
		className="flex flex-col gap-y-2"
		children={videos.map((value, index) =>
			<SidebarVideoCard key={index} {...value} />
		)}
	/>

}

export default SidebarVideoList
