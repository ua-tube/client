import { ISidebarItem } from './StudioSidebar'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { cn } from '@/utils'
import { FC } from 'react'
import {
	Tooltip,
	TooltipTrigger,
	buttonVariants,
	DynamicIcon,
	TooltipContent
} from '@/components'

export interface IStudioSidebarItemProps {
	link: ISidebarItem
	isCollapsed: boolean
}

const StudioSidebarItem: FC<IStudioSidebarItemProps> = ({
	link,
	isCollapsed
}) => {
	const { pathname } = useRouter()

	return isCollapsed ? (
		<Tooltip delayDuration={0}>
			<TooltipTrigger asChild>
				<Link
					href={link.url}
					className={cn(
						buttonVariants({ variant: 'ghost' }),
						pathname === link.url
							? 'bg-muted hover:bg-muted'
							: 'hover:bg-transparent hover:underline',
						'size-12'
					)}
				>
					<DynamicIcon name={link.icon} className='size-5' />
					<span className='sr-only' children={link.title} />
				</Link>
			</TooltipTrigger>
			<TooltipContent
				side='right'
				className='flex items-center gap-4'
				children={link.title}
			/>
		</Tooltip>
	) : (
		<Link
			href={link.url}
			className={cn(
				buttonVariants({ variant: 'ghost' }),
				pathname === link.url
					? 'bg-muted hover:bg-muted'
					: 'hover:bg-transparent hover:underline',
				'flex flex-row justify-start gap-x-3'
			)}
		>
			<DynamicIcon name={link.icon} className='size-4' />
			{link.title}
		</Link>
	)
}

export default StudioSidebarItem
