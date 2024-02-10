import { IVideo } from '@/interfaces'
import { qualities } from './video'

const categories = [
	'Усі',
	'Мікси',
	'Музика',
	'Ігри',
	'Анімації',
	'Мультфільми',
	'Пригодницький бойовик',
	'Нешодавні завантаження',
	'Ви дивилися',
	'Новинки для вас',
	'Документальні фільми',
	'Комедії',
	'Науково-фантастичні',
	'Трилери'
]


const videoEdits: IVideo[] = [
	{
		id: '1b5a68680b00c658dc3dec16b5a27f0e',
		title: 'ANAKIN SKYWALKER | Can\'t Relate (edit) [Revenge Of The Sith]',
		views: 888000,
		postedAt: '2023-09-29',
		duration: 2586,
		qualities,
		thumbnailUrl: 'https://i.ytimg.com/vi/5txddNLV650/hqdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/1b5a68680b00c658dc3dec16b5a27f0e/144p.mp4`,
		channel: {
			id: 'RA700M',
			name: 'RA700M',
			nickName: 'ra700m',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		}
	},
	{
		id: '6354c215a3c641a37ca7e4759da038ee',
		title: 'Sia - Unstoppable (Official Audio)',
		views: 172464814,
		postedAt: '2016-1-21',
		duration: 217,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/cxjvTXo9WWM/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/6354c215a3c641a37ca7e4759da038ee/144p.mp4`,
		channel: {
			name: 'Sia',
			id: 'Sia',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/6354c215a3c641a37ca7e4759da038ee.jpg',
			nickName: 'sia'
		}
	},
	{
		id: 'f0e00bb2a86ff1cec67016b787634610',
		title: 'Marvel Studios\' Avengers: Endgame - Official Trailer',
		views: 103400000,
		postedAt: '2020-03-03',
		duration: 126,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/TcMBFSGVi1c/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/f0e00bb2a86ff1cec67016b787634610/144p.mp4`,
		channel: {
			name: 'Marvel Entertainment',
			id: 'Marvel Entertainment',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'marvel'
		}
	},
	{
		id: '9e040a7a6ef9df150ae9b5e3edf9429d',
		title: 'Learn React From Scratch in 1 hour',
		views: 1032330,
		postedAt: '2023-08-09',
		duration: 2781,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/c8-eYB--j-Q/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/9e040a7a6ef9df150ae9b5e3edf9429d/144p.mp4`,
		channel: {
			name: 'constGenius',
			id: 'constGenius',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'constGenius'
		}
	},
	{
		id: '3f7f8b78d7089f21d07331edce7fd0eb',
		title: 'Beautiful Scroll Animations | Animate on Scroll',
		views: 20323,
		postedAt: '2023-10-17',
		duration: 643,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/UYSylqXW9vM/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/3f7f8b78d7089f21d07331edce7fd0eb/144p.mp4`,
		channel: {
			id: 'constGenius',
			name: 'constGenius',
			nickName: 'constGenius',
			profileImg:
				'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		}
	},
	{
		id: 'c417f3030e21e55c9013f4591035b795',
		title: 'Peaky Blinders Season 6 Official Trailer | Netflix India',
		views: 5323,
		postedAt: '2023-8-17',
		duration: 93,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/PxZ5gGfPtCQ/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/c417f3030e21e55c9013f4591035b795/144p.mp4`,
		channel: {
			name: 'Netflix India',
			id: 'Netflix India',
			nickName: 'netflix_india',
			profileImg:
				'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		}
	},
	{
		id: '116281ab79cd0184d31c17b60e171bed',
		title: 'Learn useState Hook in React JS | React Hooks Explained',
		views: 30323,
		postedAt: '2023-9-17',
		duration: 990,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/z_MnNejwR8s/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/116281ab79cd0184d31c17b60e171bed/144p.mp4`,
		channel: {
			name: 'constGenius',
			id: 'constGenius',
			nickName: 'constGenius',
			profileImg:
				'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		}
	},
	{
		id: 'f8007334bcecc56b8ccdfce585f8ac53',
		title: 'Jujutsu Kaisen - Neon Blade [Edit/AMV]',
		views: 8323,
		postedAt: '2023-11-15',
		duration: 1113,
		qualities,
		thumbnailUrl: 'https://i.ytimg.com/vi/HoxrYzuxH_Q/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/f8007334bcecc56b8ccdfce585f8ac53/144p.mp4`,
		channel: {
			name: 'Molob',
			id: 'molob',
			nickName: 'molob',
			profileImg: 'https://yt3.ggpht.com/vqRn33QWEAp2NGudzu_OPVLOEUK-qUkdYhLRyZ5cZQKqzrdMA1mDVclcMmhkmGF14hGT1EXkEQ=s68-c-k-c0x00ffffff-no-rj'
		}
	},
	{
		id: 'd6fe8454efd2c8253ead6ab79d34dddb',
		title: 'How to get ahead of 99% of people',
		views: 777777,
		postedAt: '2023-9-08',
		duration: 1117,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/p_0MaEUBMYg/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/d6fe8454efd2c8253ead6ab79d34dddb/144p.mp4`,
		channel: {
			name: 'Ruri Ohama',
			id: 'Ruri Ohama',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'ruriOhama'
		}
	},
	{
		id: '361f18312f24eac5bf69f78189037d60',
		title: 'THE BATMAN – Main Trailer',
		views: 60000000,
		postedAt: '2021-11-02',
		duration: 1000,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/mqqft2x_Aa4/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/361f18312f24eac5bf69f78189037d60/144p.mp4`,
		channel: {
			name: 'Warner Bros. Pictures',
			id: 'Warner Bros. Pictures',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'wwl'
		}
	}
]

const musicVideos: IVideo[] = [
	{
		id: 'dcfc673a421aa70e1ab78fda3b435d33',
		title: 'Hidden Details in Loki\'s Costumes! | Behind the Scenes',
		views: 20323340,
		postedAt: '2023-11-17',
		duration: 307,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/mS9nfsA-oGI/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/dcfc673a421aa70e1ab78fda3b435d33/144p.mp4`,
		channel: {
			name: 'Marvel Entertainment',
			id: 'Marvel Entertainment',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'marvel'
		}
	},
	{
		id: '85f080ed49cc2d52a1a4d1d252955e1d',
		title: 'Infinite Scrolling Animation CSS Only',
		views: 257136,
		postedAt: '2023-11-14',
		duration: 732,
		qualities,
		thumbnailUrl: 'https://i.ytimg.com/vi/3uLklfZ5Xd4/hqdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/85f080ed49cc2d52a1a4d1d252955e1d/144p.mp4`,
		channel: {
			name: 'constGenius',
			id: 'constGenius',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg',
			nickName: 'constGenius'
		}
	},
	{
		id: '5d9d5bfa615733d9606ebc05e0df138b',
		title: 'Setup Tailwind CSS with React JS | Added Tips to use it easily',
		views: 20323,
		postedAt: '2023-9-21',
		duration: 256,
		qualities,
		thumbnailUrl: 'https://i3.ytimg.com/vi/JtEZjrfx3oM/maxresdefault.jpg',
		videoUrl: `${process.env.SERVER_URL}/videos/5d9d5bfa615733d9606ebc05e0df138b/144p.mp4`,
		channel: {
			name: 'constGenius',
			id: 'constGenius',
			nickName: 'constGenius',
			profileImg: 'https://i.pinimg.com/564x/16/4d/f5/164df5e3f7a4b8b1736c3381acd32a0a.jpg'
		}
	}
]

const videos: IVideo[] = [...videoEdits, ...musicVideos]

export { videos, musicVideos, videoEdits, categories }