import { IChannel, IPlaylist } from '@/interfaces'
import { musicVideos, videoEdits, videos } from '@/data/home'
import { defaultChannel } from '@/data/video'

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
		id: 'LL',
		icon:'heart',
		name: 'Відео, які сподобалися',
		imgUrl: videos?.[0].thumbnailUrl,
		isPrivate: true,
		channel: defaultChannel,
		videos,
		videosCount: videos.length
	},
	{
		id: 'WL',
		icon:'alarm-clock',
		name: 'Переглянути пізніше',
		imgUrl: videos?.[0].thumbnailUrl,
		isPrivate: true,
		channel: defaultChannel,
		videos,
		videosCount: videos.length
	},
	{
		id: '1',
		name: 'Video edits',
		imgUrl: 'https://i.ytimg.com/vi/mKMSxrkorKI/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLCN3Y-A_W6-bwsd7zKlN01id-QhJw',
		isPrivate: true,
		channel: defaultChannel,
		videos: videoEdits,
		viewsCount: 654,
		createdAt: new Date('2023-11-01').toISOString(),
		updatedAt: new Date('2023-12-12').toISOString(),
		videosCount: 543
	},
	{
		id: '2',
		name: 'Music playlist',
		imgUrl: 'https://i.ytimg.com/vi/7Gu_siNNy10/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLAIcG-qNoBanTodeTVU6_T-X7xMhA',
		videos: musicVideos,
		viewsCount: 654,
		videosCount: 54,
		channel: defaultChannel,
		createdAt: new Date('2023-11-01').toISOString(),
		updatedAt: new Date('2023-12-12').toISOString()
	}
]


export { subscriptions, playlists }