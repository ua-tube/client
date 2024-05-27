import { getUserInitials, getImageUrl } from '@/utils'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { languages } from '@/config'
import dynamic from 'next/dynamic'
import { useAuth, useActions } from '@/hooks'
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

	return (
		<>
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
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<div className='flex items-center space-x-2'>
						<DynamicIcon name='languages' className='h-4 w-4' />
						<div
							className='flex items-center gap-x-1'
							children={`Мова: ${
								languages.find(value => value.shortName === locale)?.fullName
							}`}
						/>
					</div>
				</DropdownMenuSubTrigger>
				<DropdownMenuPortal>
					<DropdownMenuSubContent
						children={languages.map((value, index) => (
							<DropdownMenuItem key={index} asChild>
								<Link
									href={asPath}
									locale={value.shortName}
									className='flex items-center justify-between'
								>
									<span children={value.fullName} />
									{value.shortName.startsWith(locale || '') && (
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
	const { user } = useAuth()
	const { logOut } = useActions()

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
								href='/dashboard?upload=1'
								className='rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted'
							>
								<DynamicIcon name='upload' />
							</Link>
						</TooltipTrigger>
						<TooltipContent children='Завантажити нове відео' />
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
								<Link href='/dashboard/videos'>
									<DynamicIcon name='contact' className='size-4' />
									<span>Мої відео</span>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className='space-x-2' onClick={logOut}>
								<DynamicIcon name='door-open' className='size-4' />
								<span>Вихід</span>
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownBaseContent />
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
						<DynamicIcon name='person-standing' />
						<span className='hiddenOnMobile'>Увійти</span>
					</Link>
				</div>
			)}
		</div>
	)
}

export default HomeHeaderPopover
