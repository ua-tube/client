import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { DynamicIcon } from '@/components'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FC } from 'react'

export interface ISmallSidebarItemProps {
	icon: keyof typeof dynamicIconImports
	title: string
	url: string
}

const SmallSidebarItem: FC<ISmallSidebarItemProps> = ({ icon, title, url }) => {
	const { asPath } = useRouter()
	return (
		<Link
			href={url}
			className={`py-4 px-1.5 flex flex-col items-center justify-center rounded-lg gap-1 hover:bg-muted-foreground hover:text-muted ${url === asPath ? 'bg-input' : ''}`}
		>
			<DynamicIcon name={icon} className="text-base" />
			<div className="text-xs truncate" children={title} />
		</Link>
	)
}

export default SmallSidebarItem
