import LargeSidebarSection, { ILargeSidebarSectionProps } from './large-sidebar-section'
import SmallSidebarItem, { ISmallSidebarItemProps } from './small-sidebar-item'
import { HomeHeaderFirstSection } from '../home-header'
import { useSidebarContext } from '../home-layout'
import { playlists, subscriptions } from '@/data'
import { FC, Fragment, useEffect } from 'react'


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
			{ icon: 'person-standing', title: 'Ваш канал', url: '/@me' },
			{ icon: 'clock', title: 'Історія переглядів', url: '/history' },
			{ icon: 'play', title: 'Мої відео', url: '/@me/videos' },
			{ icon: 'alarm-clock', title: 'Переглянути пізніше', url: '/playlist?list=WL' },
			{ icon: 'heart', title: 'Відео, які сподобалися', url: '/playlist?list=WL' },
			...playlists.map(value => ({ icon: 'list-video' as any, title: value.name, url: `/playlist?list=${value.id}` }))
		]
	},
	{
		title: 'Підписки',
		visibleItemCount: 10,
		items: subscriptions
			.map(value =>
				({
					imgUrl: value.imgUrl,
					title: value.channelName,
					url: `/@${value.id}`
				})
			)
	},
	{
		title: 'Що нового',
		items: [
			{ icon: 'file-axis-3d', title: 'Тренди', url: '/trending' },
			{ icon: 'gamepad', title: 'Ігри', url: '/games' },
			{ icon: 'music', title: 'Музика', url: '/music' },
			{ icon: 'monitor', title: 'Фільми та телешоу', url: '/movies-and-tv' },
			{ icon: 'newspaper', title: 'Новини', url: '/news' }
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
		<div className="transform transition-transform duration-300 max-h-screen overflow-y-auto no-scrollbar">
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
		</div>
	)
}
