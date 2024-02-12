import { Tooltip, TooltipTrigger, buttonVariants, DynamicIcon, TooltipContent } from '@/components'
import HomeHeader from '@/components/layouts/home/home-header'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { FC, PropsWithChildren, useState } from 'react'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { cn } from '@/utils'

const TailwindIndicator = dynamic(() => import('@/components/tailwind-indicator'))

interface ISidebarItem {
	title: string
	url: string
	icon: keyof typeof dynamicIconImports
}


const sidebarNavItems: ISidebarItem[] = [
	{
		title: 'Огляд',
		url: '/dashboard',
		icon: 'home'

	},
	{
		title: 'Контент',
		url: '/dashboard/videos',
		icon: 'video'
	},
	{
		title: 'Коментарі',
		url: '/dashboard/comments',
		icon: 'contact'
	},
	{
		title: 'Персоналізація',
		url: '/dashboard/personalization',
		icon: 'more-horizontal'
	}
]


export interface ILargeSidebarItemProps {
	link: {
		icon: any
		title: string
		url: string
	}
	isCollapsed: boolean
}

const DashboardSidebarItem: FC<
	ILargeSidebarItemProps
> = ({ link, isCollapsed }) => {

	const { asPath } = useRouter()

	return isCollapsed ? (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Link
					href={link.url}
					className={cn(
						buttonVariants({ variant: asPath === link.url ? 'default' : 'secondary', size: 'icon' }),
						'h-9 w-9')}
				>
					<DynamicIcon name={link.icon} className="size-4" />
					<span className="sr-only">{link.title}</span>
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right" className="flex items-center gap-4" children={link.title} />
		</Tooltip>
	) : (
		<Link
			href={link.url}
			className={cn(
				buttonVariants({ variant: asPath === link.url ? 'default' : 'secondary', size: 'sm' }),
				'justify-start'
			)}
		>
			<DynamicIcon name={link.icon} className="size-4" />
			{link.title}
		</Link>
	)

}


const Sidebar: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {


	return (
		<div className="max-h-screen pr-0.5">

		</div>
	)

}


const DashboardLayout: FC<PropsWithChildren> = ({ children }) => {
	const [collapsed, setCollapsed] = useState(false)
	return <div className="max-h-screen flex flex-col">
		<HomeHeader />
		<div className="grid grid-cols-[auto,1fr] flex-grow-1 overflow-x-hidden bg-background/60">
			<Sidebar isCollapsed={collapsed} />
			<div className="overflow-x-hidden px-8 pb-4" children={children} />
		</div>
		<TailwindIndicator />
	</div>

}

export default DashboardLayout
