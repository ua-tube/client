import { getChannelUrl, getImageUrl, getUserInitials } from '@/utils'
import { useActions, useAuth } from '@/hooks'
import { useTranslation } from 'next-i18next'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { languages } from '@/config'
import dynamic from 'next/dynamic'
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

const HomeHeaderNotifications = dynamic(
	() => import('./HomeHeaderNotifications')
)

interface IHomeHeaderPopoverProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const DropdownBaseContent: FC = () => {
	const { asPath, locale } = useRouter()
	const { setTheme, theme } = useTheme()
	const { t } = useTranslation('general')

	return (
		<>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger className='space-x-2'>
					<DynamicIcon
						name={theme === 'light' ? 'sun' : 'moon'}
						className='size-4'
					/>
					<div className='flex items-center gap-x-1'>
						{t('appearance')}:{' '}
						<span className='dark:hidden'>{t('light').toLowerCase()}</span>{' '}
						<span className='hidden dark:block'>{t('dark').toLowerCase()}</span>{' '}
						{t('theme')}
					</div>
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent>
						<DropdownMenuItem
							className='justify-between'
							onClick={() => setTheme('light')}
						>
							<span>{t('light')}</span>
							<div className='checkedIcon dark:hidden' />
						</DropdownMenuItem>
						<DropdownMenuItem
							className='justify-between'
							onClick={() => setTheme('dark')}
						>
							<span>{t('dark')}</span>
							<div className='checkedIcon hidden dark:block' />
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setTheme('system')}>
							{t('system')}
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuPortal>
			</DropdownMenuSub>
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<div className='flex items-center space-x-2'>
						<DynamicIcon name='languages' className='h-4 w-4' />
						<div
							className='flex items-center gap-x-1'
							children={t('localeDesc', {
								locale: languages.find(
									value => value.shortName === (locale || 'uk')
								)?.fullName
							})}
						/>
					</div>
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent
						children={languages.map(({ shortName, fullName }, index) => (
							<DropdownMenuItem key={index} asChild>
								<Link
									href={asPath}
									locale={shortName}
									className='flex items-center justify-between'
								>
									<span children={fullName} />
									{shortName.startsWith(locale || '') && (
										<div className='checkedIcon' />
									)}
								</Link>
							</DropdownMenuItem>
						))}
					/>
				</DropdownMenuPortal>
			</DropdownMenuSub>
		</>
	)
}

const HomeHeaderPopover: FC<IHomeHeaderPopoverProps> = ({
	showFullWidthSearch,
	setShowFullWidthSearch
}) => {
	const { user, accessToken } = useAuth()
	const { logOut } = useActions()
	const { t } = useTranslation('general')

	return (
		<div
			className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? 'hidden' : 'flex'}`}
		>
			<button
				onClick={() => setShowFullWidthSearch(true)}
				className='md:hidden rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
			>
				<DynamicIcon name='search' />
			</button>

			{user ? (
				<div className='space-x-2 items-center flex'>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href='/src/pages/studio?upload=1'
								className='rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
							>
								<DynamicIcon name='upload' />
							</Link>
						</TooltipTrigger>
						<TooltipContent children={t('uploadNewVideo')} />
					</Tooltip>

					<HomeHeaderNotifications />

					<DropdownMenu>
						<DropdownMenuTrigger className='focus:border-none'>
							<Avatar className='border border-input'>
								<AvatarImage
									src={getImageUrl(user.creator.thumbnailUrl)}
									alt={user.creator?.id}
								/>
								<AvatarFallback
									children={getUserInitials(user.creator?.displayName)}
								/>
							</Avatar>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem className='space-x-2' asChild>
								<Link href='/src/pages/studio/videos'>
									<DynamicIcon name='contact' className='size-4' />
									<span>{t('studio')}</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className='space-x-2' asChild>
								<Link href='/src/pages/studio/videos'>
									<DynamicIcon name='settings' className='size-4' />
									<span>{t('personalization')}</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className='space-x-2' asChild>
								<Link href={getChannelUrl(user.id, 'videos', true)}>
									<DynamicIcon name='user-round' className='size-4' />
									<span>{t('myChannel')}</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownBaseContent />
							<DropdownMenuSeparator />
							<DropdownMenuItem
								className='space-x-2'
								onClick={() => logOut({ accessToken })}
							>
								<DynamicIcon name='door-open' className='size-4' />
								<span>{t('exit')}</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			) : (
				<div className='flex space-x-1'>
					<DropdownMenu>
						<DropdownMenuTrigger className='focus:border-none'>
							<DynamicIcon
								name='more-vertical'
								className='size-10 p-2.5 hover:bg-muted rounded-lg'
							/>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownBaseContent />
						</DropdownMenuContent>
					</DropdownMenu>
					<Link
						href='/auth'
						className='h-10 rounded-lg border border-blue-700 flex gap-x-2 items-center justify-center p-2.5 hover:bg-muted'
					>
						<DynamicIcon name='door-open' />
						<span className='hiddenOnMobile'>{t('login')}</span>
					</Link>
				</div>
			)}
		</div>
	)
}

export default HomeHeaderPopover
