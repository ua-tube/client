import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { DynamicIcon, Avatar, AvatarImage, AvatarFallback } from '@/components'
import Link from 'next/link'
import { FC } from 'react'
import { useRouter } from 'next/router'


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
			 url
		 }) => {

	const { asPath } = useRouter()

	return (
		<Link
			href={url}
			className={`h-10 justify-start w-full flex items-center rounded-lg hover:bg-muted-foreground hover:text-muted gap-4 p-3 ${
				asPath === url && 'font-bold bg-input'
			}`}
		>
			{imgUrl && (
				<Avatar className='size-7'>
					<AvatarImage src={imgUrl}/>
					<AvatarFallback children=''/>
				</Avatar>
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
