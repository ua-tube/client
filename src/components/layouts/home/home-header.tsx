import { useSidebarContext } from './home-layout'
import { useRouter } from 'next/router'
import { useTheme } from 'next-themes'
import { FC, useState } from 'react'
import { languages } from '@/config'
import Link from 'next/link'
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
} from '@/components/ui'

interface IHomeHeaderFirstSectionProps {
	hidden?: boolean
}

export const HomeHeaderFirstSection: FC<IHomeHeaderFirstSectionProps> = ({
																																					 hidden = false
																																				 }) => {
	const { toggle } = useSidebarContext()
	const { locale } = useRouter()

	return (
		<div
			className={`gap-4 items-center bg-background flex-shrink-0 ${hidden ? 'hidden' : 'flex'}`}
		>
			<button
				className="rounded-full w-10 h-10 flex items-center justify-center p-2.5"
				onClick={toggle}
				children={<DynamicIcon name="align-justify" />}
			/>
			<Link href="/" className="relative flex space-x-1.5 items-center">
				<img src="/logo.png" alt="logo" className="h-6" />
				<span className="font-semibold">UaTube</span>
				<span
					className="absolute uppercase text-muted-foreground text-[0.5rem] font-semibold top-0 -right-3.5"
					children={locale}
				/>
			</Link>
		</div>
	)
}

const HomeHeader = () => {
	const [showFullWidthSearch, setShowFullWidthSearch] = useState(false)
	const [auth, setAuth] = useState<boolean>(false)
	const { asPath, locale } = useRouter()
	const { setTheme, theme } = useTheme()

	const DropdownBaseContent: FC = () => (
		<>
			<DropdownMenuItem className="space-x-2">
				<DynamicIcon name="contact" className="h-4 w-4" />
				<span>Ваші дані на UaTube</span>
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

	return (
		<div className="flex gap-10 lg:gap-20 justify-between pt-2 mb-6 mx-4">
			<HomeHeaderFirstSection hidden={showFullWidthSearch} />
			<form
				className={`gap-4 flex-grow justify-center ${showFullWidthSearch ? 'flex' : 'hidden md:flex'}`}
			>
				{showFullWidthSearch && (
					<button
						onClick={() => setShowFullWidthSearch(false)}
						className="flex-shrink-0 rounded-full w-10 h-10 flex items-center justify-center p-2.5"
					>
						<DynamicIcon name="arrow-left" />
					</button>
				)}

				<div className="flex flex-grow max-w-[600px]">
					<input
						type="search"
						placeholder="Пошук"
						className="rounded-l-full border border-input py-1 px-4 text-lg w-full focus:border-accent outline-none"
					/>
					<button className="py-2 px-4 rounded-r-full border-input border border-l-0 flex-shrink-0 hover:bg-muted">
						<DynamicIcon name="search" />
					</button>
				</div>
			</form>

			<div
				className={`flex-shrink-0 md:gap-2 ${showFullWidthSearch ? 'hidden' : 'flex'}`}
			>
				<button
					onClick={() => setShowFullWidthSearch(true)}
					className="md:hidden rounded-full w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted"
				>
					<DynamicIcon name="search" />
				</button>

				{auth ? (
					<div className="space-x-2 items-center flex">
						<Tooltip>
							<TooltipTrigger asChild>
								<button className="rounded-full w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted">
									<DynamicIcon name="upload" />
								</button>
							</TooltipTrigger>
							<TooltipContent children="Завантажити нове відео" />
						</Tooltip>
						<Tooltip>
							<TooltipTrigger asChild>
								<button className="rounded-full w-10 h-10 flex items-center justify-center p-2.5 hover:bg-muted">
									<DynamicIcon name="bell" />
								</button>
							</TooltipTrigger>
							<TooltipContent children="Поточні сповіщення" />
						</Tooltip>

						<DropdownMenu>
							<DropdownMenuTrigger className="focus:border-none">
								<Avatar className="border border-input">
									<AvatarImage
										src="https://yt3.ggpht.com/3UlOpvyUDI7scVr98vVbCAVr-VQVEdJOXMDigVfsi_UxQavS0gnN4EOZGBbG6gHygGbn1CbVmQ=s88-c-k-c0x00ffffff-no-rj"
										alt="@sorrybodikmain"
									/>
									<AvatarFallback>SM</AvatarFallback>
								</Avatar>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem className="flex items-center space-x-2">
									<Avatar className="border border-accent">
										<AvatarImage
											src="https://yt3.ggpht.com/3UlOpvyUDI7scVr98vVbCAVr-VQVEdJOXMDigVfsi_UxQavS0gnN4EOZGBbG6gHygGbn1CbVmQ=s88-c-k-c0x00ffffff-no-rj"
											alt="@sorrybodikmain"
										/>
										<AvatarFallback>SM</AvatarFallback>
									</Avatar>
									<div className="space-y-0.5">
										<div children="Motivation for you" />
										<div
											className="flex overflow-x-hidden text-sm truncate"
											children="@motivation_for_your."
										/>
									</div>
								</DropdownMenuItem>
								<DropdownBaseContent />
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				) : (
					<>
						<DropdownMenu>
							<DropdownMenuTrigger className="focus:border-none">
								<DynamicIcon name="more-vertical" className="w-10 h-10 p-2.5 hover:bg-muted rounded-full" />
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownBaseContent />
							</DropdownMenuContent>
						</DropdownMenu>
						<button
							onClick={() => setAuth(a => !a)}
							className="h-10 rounded-full border border-blue-700 flex gap-x-2 items-center justify-center p-2.5 hover:bg-muted"
						>
							<DynamicIcon name="person-standing" />
							<span>Увійти</span>
						</button>
					</>
				)}
			</div>
		</div>
	)
}

export default HomeHeader
