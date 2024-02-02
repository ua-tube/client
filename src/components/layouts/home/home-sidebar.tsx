import { playlists, subscriptions } from '@/data'
import { useSidebarContext } from '@/providers'
import {
	ArchiveIcon,
	ChevronDownIcon,
	ChevronUpIcon,
	ClipboardIcon,
	ClockIcon,
	FileAxis3d,
	GamepadIcon,
	HeartIcon,
	HomeIcon,
	ImageIcon,
	ListIcon,
	PaperclipIcon,
	PersonStandingIcon,
	PlayIcon,
	VideoIcon
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Children, FC, ReactNode, useEffect, useState } from 'react'
import { HomeHeaderFirstSection } from './home-header'

interface ISmallSidebarItemProps {
	icon: ReactNode
	title: string
	url: string
}

interface ILargeSidebarSectionProps {
	children: ReactNode
	title?: string
	visibleItemCount?: number
}

interface ILargeSidebarItemProps {
	iconOrImgUrl: ReactNode | string
	title: string
	url: string
	isActive?: boolean
}

interface IHomeSidebarProps {
	autoHideSidebar?: boolean
	hiddenSidebar?: boolean
}

const SmallSidebarItem: FC<ISmallSidebarItemProps> = ({ icon, title, url }) => {
	const { asPath } = useRouter()
	return (
		<Link
			href={url}
			className={`py-4 px-1.5 flex flex-col items-center justify-center rounded-lg gap-1 hover:bg-muted-foreground hover:text-muted ${url === asPath ? 'bg-input' : ''}`}
		>
			<div className='text-base' children={icon} />
			<div className='text-xs truncate' children={title} />
		</Link>
	)
}

const LargeSidebarItem: FC<ILargeSidebarItemProps> = ({
	iconOrImgUrl,
	title,
	url,
	isActive = false
}) => {
	return (
		<Link
			href={url}
			className={`h-10 justify-start w-full flex items-center rounded-lg hover:bg-muted-foreground hover:text-muted gap-5 p-3 ${
				isActive && 'font-bold bg-input'
			}`}
		>
			{typeof iconOrImgUrl === 'string' ? (
				<img
					src={iconOrImgUrl}
					alt='subscribe-img'
					className='w-6 h-6 rounded-full'
				/>
			) : (
				<div children={iconOrImgUrl} />
			)}
			<div
				className='whitespace-nowrap overflow-hidden text-ellipsis text-sm'
				children={title}
			/>
		</Link>
	)
}

const LargeSidebarSection: FC<ILargeSidebarSectionProps> = ({
	children,
	title,
	visibleItemCount = Number.POSITIVE_INFINITY
}) => {
	const [isExpanded, setIsExpanded] = useState(false)
	const childrenArray = Children.toArray(children).flat()

	return (
		<div>
			{title && (
				<div
					className='ml-3 mt-2 text-lg text-black dark:text-gray-200 font-semibold mb-1'
					children={title}
				/>
			)}
			<div
				className='transition-transform duration-300'
				children={
					isExpanded ? childrenArray : childrenArray.slice(0, visibleItemCount)
				}
			/>

			{childrenArray.length > visibleItemCount && (
				<button
					onClick={() => setIsExpanded(e => !e)}
					className='text-sm w-full flex items-center rounded-lg gap-5 px-3 py-1.5 hover:bg-muted-foreground hover:text-muted'
				>
					<div
						children={isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
					/>
					<span children={isExpanded ? 'Показати меньше' : 'Показати більше'} />
				</button>
			)}
		</div>
	)
}

export const HomeSidebar: FC<IHomeSidebarProps> = ({
	autoHideSidebar,
	hiddenSidebar
}) => {
	const { isLargeOpen, isSmallOpen, close } = useSidebarContext()
	useEffect(() => {
		if (autoHideSidebar) close()
	}, [autoHideSidebar])

	return (
		<div className='transform transition-transform duration-300 max-h-screen overflow-y-auto no-scrollbar'>
			<aside
				className={`hidden sticky top-0 overflow-y-hidden pb-4 md:flex flex-col ml-1 ${
					hiddenSidebar || isLargeOpen ? 'lg:hidden' : 'lg:flex'
				}`}
			>
				<SmallSidebarItem icon={<HomeIcon />} title='Головна' url='/' />
				<SmallSidebarItem
					icon={<ClipboardIcon />}
					title='Підписки'
					url='/subscriptions'
				/>
				<SmallSidebarItem
					icon={<ListIcon />}
					title='Бібліотека'
					url='/library'
				/>
			</aside>

			{isSmallOpen && (
				<div
					onClick={close}
					className='lg:hidden fixed inset-0 z-[999] backdrop-blur-md'
				/>
			)}

			<aside
				className={`w-56 min-h-screen md:min-h-fit bg-background lg:sticky absolute top-0 pb-2 flex-col gap-2 px-2 ${
					isLargeOpen ? 'lg:flex' : 'lg:hidden'
				} ${isSmallOpen ? 'flex z-[999] max-h-screen' : 'hidden'}`}
			>
				<div className='lg:hidden pt-2 pb-4 px-2 sticky top-0'>
					<HomeHeaderFirstSection />
				</div>
				<LargeSidebarSection>
					<LargeSidebarItem
						isActive
						iconOrImgUrl={<HomeIcon />}
						title='Головна'
						url='/'
					/>

					<LargeSidebarItem
						iconOrImgUrl={<ClipboardIcon />}
						title='Підписки'
						url='/subscriptions'
					/>
				</LargeSidebarSection>

				<hr />

				<LargeSidebarSection visibleItemCount={5} title='Ви >'>
					<LargeSidebarItem
						iconOrImgUrl={<PersonStandingIcon />}
						title='Ваш канал'
						url='/@sorrybodikmain'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<ClockIcon />}
						title='Історія'
						url='/history'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<PlayIcon />}
						title='Мої відео'
						url='/your-videos'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<ClockIcon />}
						title='Переглянути пізніше'
						url='/playlist?list=WL'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<HeartIcon />}
						title='Відео, які сподобалися'
						url='/playlist?list=WL'
					/>

					{playlists.map(playlist => (
						<LargeSidebarItem
							key={playlist.id}
							iconOrImgUrl={<VideoIcon />}
							title={playlist.name}
							url={`/playlist?list=${playlist.id}`}
						/>
					))}
				</LargeSidebarSection>

				<hr />

				<LargeSidebarSection title='Підписки'>
					{subscriptions.map(subscription => (
						<LargeSidebarItem
							key={subscription.id}
							iconOrImgUrl={subscription.imgUrl}
							title={subscription.channelName}
							url={`/@${subscription.id}`}
						/>
					))}
				</LargeSidebarSection>

				<hr />

				<LargeSidebarSection title='Що нового'>
					<LargeSidebarItem
						iconOrImgUrl={<FileAxis3d />}
						title='Тренди'
						url='/trending'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<GamepadIcon />}
						title='Ігри'
						url='/games'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<ArchiveIcon />}
						title='Музика'
						url='/music'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<ImageIcon />}
						title='Фільми та телешоу'
						url='/movies-tv'
					/>
					<LargeSidebarItem
						iconOrImgUrl={<PaperclipIcon />}
						title='Новини'
						url='/news'
					/>
				</LargeSidebarSection>
			</aside>
		</div>
	)
}
