import { getUserInitials, getChannelUrl } from '@/utils'
import { defaultChannel } from '@/data'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { FC } from 'react'
import {
	DynamicIcon,
	Tooltip,
	TooltipTrigger,
	TooltipContent,
	DropdownMenu,
	DropdownMenuTrigger,
	Avatar,
	AvatarImage,
	AvatarFallback,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
	DropdownMenuSeparator
} from '@/components'

interface IDashboardHeaderPopoverProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const DashboardHeaderPopover: FC<IDashboardHeaderPopoverProps> = ({ showFullWidthSearch, setShowFullWidthSearch }) => {
	const { pathname } = useRouter()
	const { setTheme, theme } = useTheme()

	return <div
		className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? 'hidden' : 'flex'}`}
	>
		<button
			onClick={() => setShowFullWidthSearch(true)}
			className="md:hidden rounded-lg w-10 h-10 my-auto flex items-center justify-center p-2.5 hover:bg-muted"
		>
			<DynamicIcon name="search" />
		</button>

		<div className="space-x-2 items-center flex">

			<Tooltip>
				<TooltipTrigger asChild>
					<Link
						href={`${pathname}?upload=1`}
						className="rounded-lg min-w-10 text-sm space-x-2 h-10 flex items-center justify-center p-2.5 hover:bg-muted"
					>
						<DynamicIcon name="upload" />
						<span className="hiddenOnMobile" children="Завантажити відео" />
					</Link>
				</TooltipTrigger>
				<TooltipContent children="Завантажити нове відео" />
			</Tooltip>

			<DropdownMenu>
				<DropdownMenuTrigger className="focus:border-none p-3">
					<Avatar className="border border-input">
						<AvatarImage
							src={defaultChannel.profileImg}
							alt={defaultChannel.nickName}
						/>
						<AvatarFallback children={getUserInitials(defaultChannel.name)} />
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem className="flex items-center space-x-2">
						<Avatar className="border border-accent">
							<AvatarImage
								src={defaultChannel.profileImg}
								alt={defaultChannel.nickName}
							/>
							<AvatarFallback children={getUserInitials(defaultChannel.name)} />
						</Avatar>
						<div className="space-y-0.5">
							<div children={defaultChannel.name} />
							<div
								className="flex overflow-x-hidden text-sm truncate"
								children={defaultChannel.nickName}
							/>
						</div>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem asChild>
						<Link href="/public" className="flex items-center space-x-2">
							<DynamicIcon name="home" />
							<span children="Головна сторінка" />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild>
						<Link href={getChannelUrl(defaultChannel.nickName, 'index', true)}
									className="flex items-center space-x-2">
							<DynamicIcon name="person-standing" />
							<span children="Ваш канал" />
						</Link>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className="flex items-center space-x-2">
						<DynamicIcon name="door-open" />
						<span children="Вийти з аккаунту" />
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuSub>
						<DropdownMenuSubTrigger className="space-x-2">
							<DynamicIcon
								name={theme === 'light' ? 'sun' : 'moon'}
								className="size-4"
							/>

							<div className="flex items-center gap-x-1">
								Вигляд: <span className="dark:hidden">світла</span>{' '}
								<span className="hidden dark:block">темна</span> тема
							</div>
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									className="justify-between"
									onClick={() => setTheme('light')}
								>
									<span>Світла</span>
									<div className="checkedIcon dark:hidden" />
								</DropdownMenuItem>
								<DropdownMenuItem
									className="justify-between"
									onClick={() => setTheme('dark')}
								>
									<span>Темна</span>
									<div className="checkedIcon hidden dark:block" />
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => setTheme('system')}>
									Системна
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	</div>

}

export default DashboardHeaderPopover
