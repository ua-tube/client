import { getChannelUrl, getImageUrl, getUserInitials } from '@/utils'
import { useTranslation } from 'next-i18next'
import { useActions, useAuth } from '@/hooks'
import { UseState } from '@/interfaces'
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
	DynamicIcon
} from '@/components'

interface IStudioHeaderPopoverProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
	setUploadModalShow: UseState<boolean>
}

const StudioHeaderPopover: FC<IStudioHeaderPopoverProps> = ({
	showFullWidthSearch,
	setShowFullWidthSearch,
	setUploadModalShow
}) => {
	const { t } = useTranslation('studio')

	const { user, accessToken } = useAuth()
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
				<button
					onClick={() => setUploadModalShow(true)}
					className='rounded-lg min-w-10 text-sm space-x-2 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
				>
					<DynamicIcon name='plus-square' />
					<span className='hiddenOnMobile' children={t('createNewVideo')} />
				</button>

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
								<span children={t('homePage')} />
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem asChild>
							<Link
								href={getChannelUrl(user?.creator?.nickname, 'videos', true)}
								className='flex items-center space-x-2'
								target='_blank'
							>
								<DynamicIcon name='person-standing' />
								<span children={t('yourChannel')} />
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
									{t('appearance')}:
									<span className='dark:hidden'>
										{t('theme.light').toLowerCase()}
									</span>{' '}
									<span className='hidden dark:block'>
										{t('theme.dark').toLowerCase()}
									</span>
									{` ${t('theme.title')}`}
								</div>
							</DropdownMenuSubTrigger>
							<DropdownMenuPortal>
								<DropdownMenuSubContent>
									<DropdownMenuItem
										className='justify-between'
										onClick={() => setTheme('theme.light')}
									>
										<span>{t('theme.light')}</span>
										<div className='checkedIcon dark:hidden' />
									</DropdownMenuItem>
									<DropdownMenuItem
										className='justify-between'
										onClick={() => setTheme('theme.dark')}
									>
										<span>{t('theme.dark')}</span>
										<div className='checkedIcon hidden dark:block' />
									</DropdownMenuItem>
									<DropdownMenuItem onClick={() => setTheme('system')}>
										{t('theme.system')}
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuPortal>
						</DropdownMenuSub>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className='flex items-center space-x-2'
							onClick={() => logOut({ accessToken })}
						>
							<DynamicIcon name='door-open' />
							<span children={t('exitFromAccount')} />
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</div>
	)
}

export default StudioHeaderPopover
