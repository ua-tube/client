import LargeSidebarSection, { ILargeSidebarSectionProps } from './large-sidebar-section'
import SmallSidebarItem, { ISmallSidebarItemProps } from './small-sidebar-item'
import { playlists, subscriptions, defaultChannel } from '@/data'
import { HomeHeaderFirstSection } from '../home-header'
import { useSidebarContext } from '../home-layout'
import { FC, Fragment, useEffect } from 'react'
import { getChannelUrl, getPlaylistUrl } from '@/utils'
import { ScrollArea } from '@/components'


interface IHomeSidebarProps {
	autoHideSidebar?: boolean
	hiddenSidebar?: boolean
}

const smallSidebarItems: ISmallSidebarItemProps[] = [
	{ title: 'Головна', url: '/', icon: 'home' },
	{ title: 'Підписки', url: '/subscriptions', icon: 'clipboard' },
	{ title: 'Бібліотека', url: '/library', icon: 'list' }
]

const largeSections: ILargeSidebarSectionProps[] = [
	{
		items: [
			{ icon: 'home', title: 'Головна', url: '/', isActive: true },
			{ icon: 'clipboard', title: 'Підписки', url: '/subscriptions' }
		]
	},
	{
		title: 'Ви >',
		visibleItemCount: 5,
		items: [
			{ icon: 'person-standing', title: 'Ваш канал', url: getChannelUrl(defaultChannel) },
			{ icon: 'clock', title: 'Історія переглядів', url: '/history' },
			{ icon: 'play', title: 'Мої відео', url: getChannelUrl(defaultChannel, 'videos') },
			...playlists.map(value => ({
				icon: value?.icon || 'list-video' as any,
				title: value.name,
				url: getPlaylistUrl(value.id, true)
			}))
		]
	},
	{
		title: 'Підписки',
		visibleItemCount: 10,
		items: subscriptions.map(value => ({ imgUrl: value.profileImg, title: value.name, url: getChannelUrl(value) }))
	},
	{
		title: 'Що нового',
		items: [
			{ icon: 'file-axis-3d', title: 'Тренди', url: getPlaylistUrl('trending', true) },
			{ icon: 'gamepad', title: 'Ігри', url: getPlaylistUrl('games', true) },
			{ icon: 'music', title: 'Музика', url: getPlaylistUrl('music', true) },
			{ icon: 'monitor', title: 'Фільми та телешоу', url: getPlaylistUrl('movies-and-tv', true) },
			{ icon: 'newspaper', title: 'Новини', url: getPlaylistUrl('news', true) }
		]
	}
]


export const HomeSidebar: FC<
	IHomeSidebarProps
> = ({
			 autoHideSidebar,
			 hiddenSidebar
		 }) => {

	const { isLargeOpen, isSmallOpen, close } = useSidebarContext()

	useEffect(() => {
		if (autoHideSidebar) close()
	}, [autoHideSidebar])

	return (
		<ScrollArea className="transform transition-transform duration-300 max-h-screen pr-0.5">
			<aside
				className={`hidden sticky top-0 overflow-y-hidden pb-4 md:flex flex-col ml-1 ${
					hiddenSidebar || isLargeOpen ? 'lg:hidden' : 'lg:flex'
				}`}
				children={smallSidebarItems.map((value, index) => <SmallSidebarItem key={index} {...value} />)}
			/>

			{isSmallOpen && (<div onClick={close} className="lg:hidden fixed inset-0 z-[999] backdrop-blur-md" />)}

			<aside
				className={`w-56 min-h-screen md:min-h-fit bg-background lg:sticky absolute top-0 pb-2 flex-col gap-2 px-2 ${
					isLargeOpen ? 'lg:flex' : 'lg:hidden'
				} ${isSmallOpen ? 'flex z-[999] max-h-screen' : 'hidden'}`}
			>
				<div className="lg:hidden pt-2 pb-4 px-2 sticky top-0">
					<HomeHeaderFirstSection />
				</div>

				{largeSections.map((value, index) =>
					<Fragment key={index}>
						<LargeSidebarSection key={index} {...value} />
						<hr />
					</Fragment>
				)}

			</aside>
		</ScrollArea>
	)
}
