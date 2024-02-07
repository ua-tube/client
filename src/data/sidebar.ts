import { IChannel, IPlaylist } from '@/interfaces'
import { videos } from '@/data/home'

const subscriptions: IChannel[] = [
	{
		id: '1',
		name: 'Ruri Ohama',
		profileImg:
			'https://yt3.googleusercontent.com/gw6BRWav3SyG39C2kmEM1VSb5ocjEWuKRBKPhRndqOKmAxj3rzB5OOVQKeE0751DJrPWJH7c=s900-c-k-c0x00ffffff-no-rj',
		nickName: 'ruriOhama'

	},
	{
		id: '2',
		name: 'Warner Bros. Pictures',
		nickName: 'wbp',
		profileImg:
			'https://yt3.googleusercontent.com/CoYiDB8ojHTQvSwr9h8clzpcm85wiFaHroW0MaVgTnDEXAIMxhGlzC5Vwo9N3-z3obfVqc_G62I=s900-c-k-c0x00ffffff-no-rj'
	},
	{
		id: '3',
		name: 'Netflix India',
		nickName: 'netflix_india',
		profileImg:
			'https://yt3.googleusercontent.com/zgMN9BuSQByG1SrpmLwcNB3MQhjDhS_pl9H1h7TaRievMfS4UpU7Z36j77z5_hnIW4N8uFX3NA=s900-c-k-c0x00ffffff-no-rj'
	}
]

const playlists: IPlaylist[] = [
	{
		id: '1',
		name: 'React',
		imgUrl: 'https://i.ytimg.com/vi/mKMSxrkorKI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCN3Y-A_W6-bwsd7zKlN01id-QhJw',
		isPrivate: true,
		channel: {
			name: 'sorrybodikmain',
			id: 'sorrybodikmain',
			nickName: 'sorrybodikmain',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		},
		videos,
		viewsCount: 654,
		createdAt: new Date('2023-11-01').toISOString(),
		updatedAt: new Date('2023-12-12').toISOString(),
		videosCount: 543
	},
	{
		id: '2',
		name: 'HTML CSS Projects',
		imgUrl: 'https://i.ytimg.com/vi/7Gu_siNNy10/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAIcG-qNoBanTodeTVU6_T-X7xMhA',
		videosCount: 54
	},
	{
		id: '3',
		name: 'React with Tailwind',
		imgUrl: 'https://i.ytimg.com/vi/TG1lH-__u8g/hqdefault.jpg?sqp=-oaymwE1CKgBEF5IVfKriqkDKAgBFQAAiEIYAXABwAEG8AEB-AH-CYAC0AWKAgwIABABGHIgUSg5MA8=&rs=AOn4CLC7uGsxsOyeAGsFha9xuEz-vlSjqQ',
		isPrivate: true,
		videosCount: 765
	},
	{
		id: '4',
		name: 'React Hooks',
		imgUrl: 'https://i.ytimg.com/vi/0mkzcQ8W3-g/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCjQ1QTKFs2oTCL6R97rdjJRzt09Q',
		videosCount: 32
	},
	{
		id: '5',
		name: 'Next.JS',
		imgUrl: 'https://i.ytimg.com/vi/IWoKnOvtNMA/hqdefault.jpg?sqp=-oaymwE1CKgBEF5IVfKriqkDKAgBFQAAiEIYAXABwAEG8AEB-AG2CIACkgmKAgwIABABGFkgZShhMA8=&rs=AOn4CLBr17u7sZEla9o2fABNkV2TONPw3g',
		isPrivate: false,
		videosCount: 75
	}
]


export { subscriptions, playlists }