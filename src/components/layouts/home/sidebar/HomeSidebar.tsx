import { ScrollArea, DrawerHeader, DrawerContent, Drawer } from '@/components'
import SidebarSection, { ISidebarSectionProps } from './SidebarSection'
import HomeHeaderLogo from '../header/HomeHeaderLogo'
import { FC, Fragment, useEffect } from 'react'
import { useSidebarContext } from '@/providers'
import { useScreenSize, useAuth } from '@/hooks'
import { getPlaylistUrl, getChannelUrl } from '@/utils'

interface IHomeSidebarProps {
	autoShowSidebar?: boolean
	openInDrawer?: boolean
}

export const HomeSidebar: FC<IHomeSidebarProps> = ({
	autoShowSidebar,
	openInDrawer
}) => {
	const { isOpen, toggle } = useSidebarContext()
	const { isScreenSmall } = useScreenSize()

	const { user } = useAuth()

	const largeSections: ISidebarSectionProps[] = [
		{
			items: [
				{ icon: 'home', title: 'Головна', url: '/' },
				{ icon: 'clipboard', title: 'Підписки', url: '/subscriptions' }
			]
		},
		...(user ? [{
			title: 'Ви >',
			visibleItemCount: 5,
			items: [
				{
					icon: 'person-standing' as any,
					title: 'Ваш канал',
					url: getChannelUrl(user?.creator?.nickname)
				},
				{ icon: 'clock', title: 'Історія переглядів', url: '/history' },
				{
					icon: 'play',
					title: 'Мої відео',
					url: getChannelUrl(user?.creator?.nickname, 'videos')
				}
				// ...playlists.map(value => ({
				//  icon: value?.icon || ('list-video' as any),
				//  title: value.name,
				//  url: getPlaylistUrl(value.id, true)
				// }))
			]
		}] : []),

		// {
		// 	title: 'Підписки',
		// 	visibleItemCount: 10,
		// 	items: subscriptions.map(value => ({
		// 		imgUrl: value.profileImg,
		// 		title: value.name,
		// 		url: getChannelUrl(value.nickName)
		// 	}))
		// },
		{
			title: 'Що нового',
			items: [
				{
					icon: 'file-axis-3d',
					title: 'Тренди',
					url: getPlaylistUrl('trending', true)
				},
				{ icon: 'gamepad', title: 'Ігри', url: getPlaylistUrl('games', true) },
				{ icon: 'music', title: 'Музика', url: getPlaylistUrl('music', true) },
				{
					icon: 'monitor',
					title: 'Фільми та телешоу',
					url: getPlaylistUrl('movies-and-tv', true)
				},
				{
					icon: 'newspaper',
					title: 'Новини',
					url: getPlaylistUrl('news', true)
				}
			]
		}
	]

	useEffect(() => {
		if (autoShowSidebar && !isScreenSmall) toggle()
	}, [autoShowSidebar])

	const SidebarContent = () => (
		<ScrollArea
			className='h-[90vh] md:h-auto pr-2 w-56'
			children={largeSections.map((value, index) => (
				<Fragment key={index}>
					<SidebarSection key={index} {...value} />
					<hr />
				</Fragment>
			))}
		/>
	)

	return openInDrawer || isScreenSmall ? (
		<Drawer
			open={isOpen}
			onOpenChange={toggle}
			shouldScaleBackground
			direction='left'
			fixed
		>
			<DrawerContent className='w-56'>
				<DrawerHeader>
					<HomeHeaderLogo />
				</DrawerHeader>
				<SidebarContent />
			</DrawerContent>
		</Drawer>
	) : (
		<>
			{isOpen && (
				<aside className='fixed h-screen top-0 pb-2 mt-20 flex flex-col gap-2 px-2 bg-background'>
					<SidebarContent />
				</aside>
			)}
		</>
	)
}
