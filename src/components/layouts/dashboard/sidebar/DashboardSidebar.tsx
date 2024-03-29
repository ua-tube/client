import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn, getUserInitials, getChannelUrl } from '@/utils'
import DashboardSidebarItem from './DashboardSidebarItem'
import { useSidebarContext } from '@/providers'
import { FC, useEffect } from 'react'
import { defaultChannel } from '@/data'
import { useScreenSize } from '@/hooks'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	Avatar,
	AvatarImage,
	AvatarFallback,
	Drawer,
	DrawerContent,
	DrawerHeader,
	Skeleton
} from '@/components'

const HomeHeaderLogo = dynamic(
	() => import( '../../home/header/HomeHeaderLogo'),
	{ loading: () => <Skeleton className="px-4 py-2 rounded-lg" /> }
)


export interface ISidebarItem {
	title: string
	url: string
	icon: keyof typeof dynamicIconImports
}

interface ISidebarProps {
	openInDrawer?: boolean
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
		title: 'Аналітика',
		url: '/dashboard/analytics',
		icon: 'area-chart'
	},
	{
		title: 'Персоналізація',
		url: '/dashboard/personalization',
		icon: 'more-horizontal'
	}
]


const DashboardSidebar: FC<ISidebarProps> = ({ openInDrawer }) => {
	const { isOpen, toggle } = useSidebarContext()
	const { isScreenSmall } = useScreenSize()

	useEffect(() => {
		if (!isScreenSmall && !isOpen) toggle()
	}, [isScreenSmall])


	const DashboardSidebarContent: FC = () => {
		return <div className='h-[90vh]'>
			<div className="flex flex-col justify-center items-center gap-y-4 my-5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href={getChannelUrl(defaultChannel.nickName, 'index', true)}
							target="_blank"
						>
							<Avatar className={cn('size-40', !isOpen && 'size-12')}>
								<AvatarImage src={defaultChannel.profileImg} />
								<AvatarFallback children={getUserInitials(defaultChannel.name)} />
							</Avatar>
						</Link>
					</TooltipTrigger>
					<TooltipContent className="z-[99999999]" side="right" children="Перейти на ваш канал" />
				</Tooltip>
				<div className={cn('flex flex-col items-center', !isOpen && 'hidden')}>
					<span className="text-muted-foreground" children="Ваш канал" />
					<p children={defaultChannel.name} />
				</div>
			</div>

			<div
				className="flex flex-col gap-y-3"
				children={
					sidebarNavItems.map((value, index) =>
						<DashboardSidebarItem
							key={index}
							isCollapsed={!isOpen}
							link={value}
						/>
					)}
			/>
		</div>
	}

	return (openInDrawer || isScreenSmall) ?
		<Drawer
			open={isOpen}
			onOpenChange={toggle}
			shouldScaleBackground
			direction="left"
			fixed
		>
			<DrawerContent className="w-56">
				<DrawerHeader>
					<HomeHeaderLogo />
				</DrawerHeader>
				<DashboardSidebarContent />
			</DrawerContent>
		</Drawer>
		:
		<aside className="fixed h-screen top-0 pb-2 mt-20 flex flex-col gap-2 px-4 border-r border-muted bg-background">
			<DashboardSidebarContent />
		</aside>

}

export default DashboardSidebar
