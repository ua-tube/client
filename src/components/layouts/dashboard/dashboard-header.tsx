import { getUserInitials, getChannelUrl } from '@/utils'
import { defaultChannel } from '@/data'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import Link from 'next/link'
import {
	DropdownMenuItem,
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
	DropdownMenuSeparator,
	DropdownMenuSubTrigger,
	DropdownMenuPortal,
	DropdownMenuSubContent,
	DropdownMenuSub,
	Skeleton
} from '@/components'

const HomeHeaderLogo = dynamic(
	() => import( '../home/header/home-header-logo'),
	{ loading: () => <Skeleton className="px-4 py-2 rounded-lg" /> }
)

const DashboardHeader = () => {
	const [showFullWidthSearch, setShowFullWidthSearch] = useState(false)
	const { setTheme, theme } = useTheme()
	const { pathname } = useRouter()
	return (

		<div
			className="flex gap-10 lg:gap-20 justify-between px-4 border-b border-muted sticky top-0 z-10 bg-background/50 backdrop-blur-lg">
			<HomeHeaderLogo hidden={showFullWidthSearch} />
			<form
				className={`gap-4 flex-grow justify-center ${showFullWidthSearch ? 'flex' : 'hidden md:flex'}`}
			>
				{showFullWidthSearch && (
					<button
						onClick={() => setShowFullWidthSearch(false)}
						className="flex-shrink-0 rounded-lg size-10 flex my-auto items-center justify-center p-2.5"
					>
						<DynamicIcon name="arrow-left" />
					</button>
				)}

				<div className="flex flex-grow max-w-[500px] h-fit py-2 my-auto">
					<input
						type="search"
						placeholder="Пошук у вашому каналі"
						className="rounded-l-lg border border-input py-1 px-4 text-lg w-full focus:border-accent outline-none"
					/>
					<button className="py-2 px-4 rounded-r-lg border-input border border-l-0 flex-shrink-0 hover:bg-muted">
						<DynamicIcon name="search" />
					</button>
				</div>
			</form>

			<div
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
								<Link href="/" className="flex items-center space-x-2">
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
		</div>
	)
}

export default DashboardHeader
