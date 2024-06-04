import { Drawer, DrawerContent, DrawerHeader, ScrollArea } from '@/components'
import SidebarSection, { ISidebarSectionProps } from './SidebarSection'
import { LibraryService } from '@/services/library.service'
import { FC, Fragment, useEffect, useState } from 'react'
import { getChannelUrl, getPlaylistUrl } from '@/utils'
import { IPlaylist, ISubscription } from '@/interfaces'
import HomeHeaderLogo from '../header/HomeHeaderLogo'
import { SubscriptionsService } from '@/services'
import { useAuth, useScreenSize } from '@/hooks'
import { useSidebarContext } from '@/providers'
import { useTranslation } from 'next-i18next'

interface IHomeSidebarProps {
	autoShowSidebar?: boolean
	openInDrawer?: boolean
}

export const HomeSidebar: FC<IHomeSidebarProps> = ({
	autoShowSidebar,
	openInDrawer
}) => {
	const { t } = useTranslation('home-sidebar')
	const { user } = useAuth()
	const { isOpen, toggle } = useSidebarContext()
	const { isScreenSmall } = useScreenSize()

	const [playlists, setPlaylists] = useState<IPlaylist[]>([])
	const [subscriptions, setSubscriptions] = useState<ISubscription[]>([])

	useEffect(() => {
		;(async () => {
			if (user) {
				try {
					const { data } = await LibraryService.getPlaylistsBySelf({
						page: 1,
						perPage: 50
					})
					setPlaylists(data.list)
					const { data: subs } = await SubscriptionsService.getSubscriptions()
					setSubscriptions(subs)
				} catch {}
			}
		})()
	}, [])

	const largeSections: ISidebarSectionProps[] = [
		{
			items: [{ icon: 'home', title: t('general'), url: '/' }]
		},
		...(user
			? ([
					{
						title: t('you'),
						visibleItemCount: 5,
						items: [
							{
								icon: 'person-standing',
								title: t('yourChannel'),
								url: getChannelUrl(user?.creator?.nickname)
							},
							{ icon: 'clock', title: t('viewsHistory'), url: '/history' },
							{
								icon: 'play',
								title: t('myVideos'),
								url: getChannelUrl(user?.creator?.nickname, 'videos')
							},
							{
								icon: 'thumbs-up',
								title: t('likedVideos'),
								url: getPlaylistUrl('LL', true)
							},
							{
								icon: 'thumbs-down',
								title: t('dislikedVideos'),
								url: getPlaylistUrl('DL', true)
							},
							{
								icon: 'timer',
								title: t('watchLater'),
								url: getPlaylistUrl('WL', true)
							},
							...(playlists
								? playlists?.map(value => ({
										icon: value?.icon || ('list-video' as any),
										title: value.title,
										url: getPlaylistUrl(value.id, true)
									}))
								: [])
						]
					},
					...(subscriptions && subscriptions.length > 1
						? [
								{
									title: t('subscriptions'),
									visibleItemCount: 10,
									items: subscriptions?.map(value => ({
										imgUrl: value.target.thumbnailUrl,
										title: value.target.displayName,
										url: getChannelUrl(value.target.nickname)
									}))
								}
							]
						: [])
				] as ISidebarSectionProps[])
			: [])
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
			<DrawerContent className='w-56 h-screen'>
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
