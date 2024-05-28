import { getChannelUrl, getImageUrl, getUserInitials } from '@/utils'
import { useActions, useAuth } from '@/hooks'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { FC } from 'react'
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
	DynamicIcon,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/components'

interface IDashboardHeaderPopoverProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
	setUploadModalShow: UseState<boolean>
}

const DashboardHeaderPopover: FC<IDashboardHeaderPopoverProps> = ({
	showFullWidthSearch,
	setShowFullWidthSearch,
	setUploadModalShow
}) => {
	const { user } = useAuth()
	const { logOut } = useActions()
	const { setTheme, theme } = useTheme()

	return (
		<div
			className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? 'hidden' : 'flex'}`}
		>
			<button
				onClick={() => setShowFullWidthSearch(true)}
				className='md:hidden rounded-lg w-10 h-10 my-auto flex items-center justify-center p-2.5 hover:bg-muted'
			>
				<DynamicIcon name='search' />
			</button>

			<div className='space-x-2 items-center flex'>
				<Tooltip>
					<TooltipTrigger asChild>
						<button
							onClick={() => setUploadModalShow(true)}
							className='rounded-lg min-w-10 text-sm space-x-2 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
						>
							<DynamicIcon name='upload' />
							<span className='hiddenOnMobile' children='Завантажити відео' />
						</button>
					</TooltipTrigger>
					<TooltipContent children='Завантажити нове відео' />
				</Tooltip>

				<DropdownMenu>
					<DropdownMenuTrigger className='focus:border-none p-3'>
						<Avatar className='border border-input'>
							<AvatarImage
								src={getImageUrl(user?.creator.thumbnailUrl)}
								alt={user?.creator?.nickname}
							/>
							<AvatarFallback
								children={getUserInitials(user?.creator?.displayName)}
							/>
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem className='flex items-center space-x-2'>
							<Avatar className='border border-accent'>
								<AvatarImage
									src={getImageUrl(user?.creator.thumbnailUrl)}
									alt={user?.creator?.nickname}
								/>
								<AvatarFallback
									children={getUserInitials(user?.creator?.displayName)}
								/>
							</Avatar>
							<div className='space-y-0.5'>
								<div children={user?.creator?.displayName} />
								<div
									className='flex overflow-x-hidden text-sm truncate'
									children={user?.creator?.nickname}
								/>
							</div>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<Link href='/' className='flex items-center space-x-2'>
								<DynamicIcon name='home' />
								<span children='Головна сторінка' />
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={getChannelUrl(user?.creator?.nickname, 'videos', true)}
								className='flex items-center space-x-2'
								target='_blank'
							>
								<DynamicIcon name='person-standing' />
								<span children='Ваш канал' />
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuSub>
							<DropdownMenuSubTrigger className='space-x-2'>
								<DynamicIcon
									name={theme === 'light' ? 'sun' : 'moon'}
									className='size-4'
								/>

								<div className='flex items-center gap-x-1'>
									Вигляд: <span className='dark:hidden'>світла</span>{' '}
									<span className='hidden dark:block'>темна</span> тема
								</div>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										className='justify-between'
										onClick={() => setTheme('light')}
									>
										<span>Світла</span>
										<div className='checkedIcon dark:hidden' />
									</DropdownMenuItem>
									<DropdownMenuItem
										className='justify-between'
										onClick={() => setTheme('dark')}
									>
										<span>Темна</span>
										<div className='checkedIcon hidden dark:block' />
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme('system')}>
										Системна
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='flex items-center space-x-2'
							onClick={logOut}
						>
							<DynamicIcon name='door-open' />
							<span children='Вийти з аккаунту' />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}

export default DashboardHeaderPopover
