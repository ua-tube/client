import { Tooltip, TooltipTrigger, buttonVariants, DynamicIcon, TooltipContent } from '@/components'
import { ISidebarItem } from './dashboard-sidebar'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { cn } from '@/utils'
import { FC } from 'react'

export interface IDashboardSidebarItemProps {
	link: ISidebarItem
	isCollapsed: boolean
}

const DashboardSidebarItem: FC<
	IDashboardSidebarItemProps
> = ({ link, isCollapsed }) => {

	const { asPath } = useRouter()

	return isCollapsed ? (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Link
					href={link.url}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						asPath === link.url
							? 'bg-muted hover:bg-muted'
							: 'hover:bg-transparent hover:underline',
						'size-12')}
				>
					<DynamicIcon name={link.icon} className="size-5" />
					<span className="sr-only" children={link.title} />
				</Link>
			</TooltipTrigger>
			<TooltipContent side="right" className="flex items-center gap-4" children={link.title} />
		</Tooltip>
	) : (
		<Link
			href={link.url}
			className={cn(
				buttonVariants({ variant: 'ghost' }),
				asPath === link.url
					? 'bg-muted hover:bg-muted'
					: 'hover:bg-transparent hover:underline',
				'flex flex-row justify-start gap-x-3'
			)}
		>
			<DynamicIcon name={link.icon} className="size-4" />
			{link.title}
		</Link>
	)

}

export default DashboardSidebarItem
