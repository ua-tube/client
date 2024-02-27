import { getUserInitials } from '@/utils'
import { defaultChannel } from '@/data'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { languages } from '@/config'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { FC, useState } from 'react'
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
	DropdownMenuSeparator,
	Button
} from '@/components'

const HomeHeaderNotifications = dynamic(() => import('./HomeHeaderNotifications'))

interface IHomeHeaderPopoverProps {
	showFullWidthSearch: boolean
	setShowFullWidthSearch: UseState<boolean>
}

const HomeHeaderPopover: FC<IHomeHeaderPopoverProps> = ({ showFullWidthSearch, setShowFullWidthSearch }) => {
	const { asPath, locale } = useRouter()
	const { setTheme, theme } = useTheme()
	const [auth, setAuth] = useState<boolean>(false)


	const DropdownBaseContent: FC = () => (
		<>
			<DropdownMenuItem className="space-x-2" asChild>
				<Link href="/dashboard">
					<DynamicIcon name="contact" className="size-4" />
					<span>Ваші дані на UaTube</span>
				</Link>
			</DropdownMenuItem>
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
			<DropdownMenuSub>
				<DropdownMenuSubTrigger>
					<div className="flex items-center space-x-2">
						<DynamicIcon name="languages" className="h-4 w-4" />
						<div
							className="flex items-center gap-x-1"
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
									className="flex items-center justify-between"
								>
									<span children={value.fullName} />
									{value.shortName.startsWith(locale || '') && (<div className="checkedIcon" />)}
								</Link>
							</DropdownMenuItem>
						))}
					/>
				</DropdownMenuPortal>
			</DropdownMenuSub>
			<DropdownMenuSeparator />
			<DropdownMenuItem className="space-x-2">
				<DynamicIcon name="settings" className="h-4 w-4" />
				<span>Налаштування</span>
			</DropdownMenuItem>
		</>
	)

	return <div
		className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? 'hidden' : 'flex'}`}
	>
		<button
			onClick={() => setShowFullWidthSearch(true)}
			className="md:hidden rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted"
		>
			<DynamicIcon name="search" />
		</button>

		{auth ? (
			<div className="space-x-2 items-center flex">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="/dashboard?upload=1"
							className="rounded-lg w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted"
						>
							<DynamicIcon name="upload" />
						</Link>
					</TooltipTrigger>
					<TooltipContent children="Завантажити нове відео" />
				</Tooltip>

				<HomeHeaderNotifications />

				<DropdownMenu>
					<DropdownMenuTrigger className="focus:border-none">
						<Avatar className="border border-input">
							<AvatarImage
								src={defaultChannel.profileImg}
								alt={defaultChannel.nickName}
							/>
							<AvatarFallback children={getUserInitials(defaultChannel.name)} />
						</Avatar>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
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
						<DropdownBaseContent />
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		) : (
			<div className='flex space-x-1'>
				<DropdownMenu>
					<DropdownMenuTrigger className="focus:border-none">
						<DynamicIcon
							name="more-vertical"
							className="size-10 p-2.5 hover:bg-muted rounded-lg"
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownBaseContent />
					</DropdownMenuContent>
				</DropdownMenu>
				<Link
					href="/auth"
					className="h-10 rounded-lg border border-blue-700 flex gap-x-2 items-center justify-center p-2.5 hover:bg-muted"
				>
					<DynamicIcon name="person-standing" />
					<span className='hiddenOnMobile'>Увійти</span>
				</Link>
				<Button variant="secondary" children="Канал" onClick={() => setAuth(true)} />
			</div>
		)}
	</div>

}

export default HomeHeaderPopover
