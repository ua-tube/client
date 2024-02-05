import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { DynamicIcon } from '@/components'
import Link from 'next/link'
import { FC } from 'react'


export interface ILargeSidebarItemProps {
	icon?: keyof typeof dynamicIconImports
	imgUrl?: string
	title: string
	url: string
	isActive?: boolean
}

const LargeSidebarItem: FC<
	ILargeSidebarItemProps
> = ({
			 icon,
			 imgUrl,
			 title,
			 url,
			 isActive = false
		 }) => {
	return (
		<Link
			href={url}
			className={`h-10 justify-start w-full flex items-center rounded-lg hover:bg-muted-foreground hover:text-muted gap-5 p-3 ${
				isActive && 'font-bold bg-input'
			}`}
		>
			{imgUrl && (
				<img
					src={icon}
					alt="subscribe-img"
					className="w-6 h-6 rounded-full"
				/>
			)}
			{icon && (<DynamicIcon name={icon} />)}
			<div
				className="whitespace-nowrap overflow-hidden text-ellipsis text-sm"
				children={title}
			/>
		</Link>
	)
}

export default LargeSidebarItem
