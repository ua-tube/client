import { INotification } from '@/interfaces'
import { getVideoUrl } from '@/utils'
import { videos } from '@/data/videos'

const notifications: INotification[] = [
	{
		id: '1',
		message: 'Нове відео від **Ukrainian Cooking with Olha!',
		url: getVideoUrl(videos[0].id, undefined, undefined, true),
		channel: {
			id: '1',
			name: 'Ukrainian Cooking with Olha',
			nickName: 'olha',
			profileImg: 'https://picsum.photos/500/500?random=1',
			createdAt: '2023-11-14T12:00:00.000Z',
			videosCount: 100,
			description: 'Смачні та прості рецепти української кухні.',
			profileBgImg: 'https://picsum.photos/500/500?random=2',
			videosViewsCount: 10000,
			subscribersCount: 1000
		}
	},
	{
		id: '2',
		message: 'The Hacksmith розпочав пряму трансляцію!',
		url: getVideoUrl(videos[1].id, undefined, undefined, true),
		channel: {
			id: '2',
			name: 'The Hacksmith',
			nickName: 'jamesHobson',
			profileImg: 'https://picsum.photos/500/500?random=2',
			createdAt: '2023-11-14T12:00:00.000Z',
			videosCount: 100,
			description: 'Канал про неймовірні винаходи та цікаві експерименти.',
			profileBgImg: 'https://picsum.photos/500/500?random=3',
			videosViewsCount: 10000,
			subscribersCount: 1000
		}
	},
	{
		id: '3',
		message: '**Kurzgesagt – In a Nutshell** оголосив про нове відео!',
		url: getVideoUrl(videos[2].id, undefined, undefined, true),
		channel: {
			id: '3',
			name: 'Kurzgesagt – In a Nutshell',
			nickName: 'kurzgesagt',
			profileImg: 'https://picsum.photos/500/500?random=3',
			createdAt: '2023-11-14T12:00:00.000Z',
			videosCount: 100,
			description: 'Наукові анімаційні відео на різні теми.',
			profileBgImg: 'https://picsum.photos/500/500?random=4',
			videosViewsCount: 10000,
			subscribersCount: 1000
		}
	},
	{
		id: '4',
		message:
			'Вам сподобалося відео **Як зробити павука з паперу** від **Creative Kids?',
		url: getVideoUrl(videos[3].id, undefined, undefined, true),
		channel: {
			id: '4',
			name: 'Creative Kids',
			nickName: 'creativeKids',
			profileImg: 'https://picsum.photos/500/500?random=4',
			createdAt: '2023-11-14T12:00:00.000Z',
			videosCount: 100,
			description: 'Прості та цікаві DIY-проекти для дітей.',
			profileBgImg: 'https://picsum.photos/500/500?random=5',
			videosViewsCount: 10000,
			subscribersCount: 1000
		}
	}
]

export { notifications }
