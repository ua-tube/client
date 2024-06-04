import { DynamicIcon, Avatar, AvatarImage, AvatarFallback } from '@/components'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { useRouter } from 'next/router'
import { getImageUrl } from '@/utils'
import Link from 'next/link'
import { FC } from 'react'

export interface ISidebarItemProps {
	icon?: keyof typeof dynamicIconImports
	imgUrl?: string
	title: string
	url: string
}

const SidebarItem: FC<ISidebarItemProps> = ({ icon, imgUrl, title, url }) => {
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
					<AvatarImage src={getImageUrl(imgUrl)} />
					<AvatarFallback children='' />
				</Avatar>
			)}

			{icon && <DynamicIcon name={icon} />}

			<div
				className='whitespace-nowrap overflow-hidden text-ellipsis text-sm'
				children={title}
			/>
		</Link>
	)
}

export default SidebarItem
