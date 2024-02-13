import { Tooltip, TooltipTrigger, TooltipContent, Avatar, AvatarImage, AvatarFallback } from '@/components'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn, getUserInitials, getChannelUrl } from '@/utils'
import DashboardSidebarItem from './dashboard-sidebar-item'
import useScreenSize from '@/hooks/useScreenSize'
import { useSidebarContext } from '@/providers'
import { defaultChannel } from '@/data'
import { FC, Fragment } from 'react'
import Link from 'next/link'


export interface ISidebarItem {
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
		title: 'Скарги',
		url: '/dashboard/complaints',
		icon: 'message-square-warning'
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

const addSidebarNavItems: ISidebarItem[] = [
	{
		title: 'Налаштування',
		url: '/dashboard/settings',
		icon: 'settings'
	},
	{
		title: 'Скарги',
		url: '/dashboard?sendComplaints=1',
		icon: 'message-square-warning'
	}
]


const DashboardSidebar: FC = () => {
	const { isOpen, toggle } = useSidebarContext()
	const { isScreenSmall } = useScreenSize()

	return (<>
			{isScreenSmall && isOpen &&
				<div
					className="lg:hidden fixed inset-0 z-[999] backdrop-blur-md"
					onClick={toggle}
				/>
			}

			<aside
				className={cn(
					'min-h-screen md:min-h-fit lg:sticky absolute top-0 pb-2 flex-col' +
					' gap-y-10 px-2 bg-background border-r border-muted justify-between',
					isScreenSmall ? (isOpen ? 'flex z-[999] max-h-screen overflow-y-auto w-56 ' : 'hidden') : (isOpen ? 'w-56' : 'w-fit')
				)}
			>
				<div className="space-y-10">
					<div className="flex flex-col justify-center items-center gap-y-4 mt-5">
						<Tooltip>
							<TooltipTrigger asChild>
								<Link
									href={getChannelUrl({ nickName: defaultChannel.nickName }, 'index', true)}
									target="_blank"
								>
									<Avatar className={cn('size-40', !isOpen && 'size-12')}>
										<AvatarImage src={defaultChannel.profileImg} />
										<AvatarFallback children={getUserInitials(defaultChannel.name)} />
									</Avatar>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="right" children="Перейти на ваш канал" />
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

				<div
					className="flex flex-col"
					children={
						addSidebarNavItems.map((value, index) =>
							<DashboardSidebarItem
								key={index}
								isCollapsed={!isOpen}
								link={value}
							/>
						)}
				/>

			</aside>
		</>
	)
}

export default DashboardSidebar
