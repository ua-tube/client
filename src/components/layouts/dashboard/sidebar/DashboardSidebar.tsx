import { Tooltip, TooltipTrigger, TooltipContent, Avatar, AvatarImage, AvatarFallback } from '@/components'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { cn, getUserInitials, getChannelUrl } from '@/utils'
import DashboardSidebarItem from './DashboardSidebarItem'
import { useSidebarContext } from '@/providers'
import { FC, Fragment, useEffect } from 'react'
import { defaultChannel } from '@/data'
import { useScreenSize } from '@/hooks'
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


const DashboardSidebar: FC = () => {
	const { isOpen, toggle } = useSidebarContext()
	const { isScreenSmall } = useScreenSize()

	useEffect(() => {
		if (!isScreenSmall && !isOpen) toggle()
	}, [isScreenSmall])

	return (<>
			{isScreenSmall && isOpen &&
				<div
					className="lg:hidden fixed inset-0 z-[999] backdrop-blur-md"
					onClick={toggle}
				/>
			}

			<aside
				className={cn(
					'min-h-screen md:min-h-fit lg:sticky top-20 z-0 absolute pb-2 flex-col',
					'gap-y-12 px-2 bg-background border-r border-muted',
					isScreenSmall ?
						(isOpen ? 'flex z-[999] max-h-screen w-56' : 'hidden') :
						(isOpen ? 'w-56' : 'w-fit')
				)}
			>

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


			</aside>
		</>
	)
}

export default DashboardSidebar