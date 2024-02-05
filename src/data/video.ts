import { IComment, IReportReason, IVideo } from '@/interfaces'

const videoSpeeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4]

const defaultVideo: IVideo = {
	id: 'nRc6934CNs1',
	title: 'гипнозы - мальбэк & сюзанна (slowed and reverb)',
	description: 'Let me know which track you would like next from NightDrive Part 2\n' +
		'Mix:   \n' +
		'\n' +
		' • Skeler - N i g h t D r i v e スケラー PAR...  \n' +
		'\n' +
		'Keep updated with future releases: \n' +
		'INST:  \n' +
		'\n' +
		' / skelerofficial  \n' +
		'SPOTIFY: https://open.spotify.com/artist/7ks4L...\n' +
		'\n' +
		'LYRICS: \n' +
		'\n' +
		'You say you don\'t want me\n' +
		'You call me good for nothing straight to my face\n' +
		'You say you don\'t need me\n' +
		'You call me good for nothing, a waste of space\n' +
		'\n' +
		'Don\'t remind me\n' +
		'I\'m minding my own damn business\n' +
		'Don\'t try to find me\n' +
		'I\'m better left alone in this\n' +
		'It doesn\'t surprise me\n' +
		'Do you really think that I could care\n' +
		'If you really don\'t like me\n' +
		'Find somebody else\n' +
		'It could be anyone else out there\n' +
		'\n' +
		'Don\'t fret\n' +
		'I don\'t ever wanna see you\n' +
		'And I never wanna meet you again\n' +
		'One thing\n' +
		'When you\'re angry, you\'re a jerk\n' +
		'And then you treat me like I\'m worth nothing\n' +
		'Don\'t fret\n' +
		'I don\'t ever wanna see you\n' +
		'And I never wanna meet you again\n' +
		'It\'ll happen again\n' +
		'I\'ll watch it happen over and over again\n' +
		'\n' +
		'I watch the walls caving in on me\n' +
		'I\'m sick of feeling so fucking lonely\n' +
		'By now I\'ve given up all hope\n' +
		'I guess I\'m better off alone\n' +
		'\n' +
		'\n' +
		'Edit: @aparlex',
	likesCount: 34343,
	commentsCount: 435435,
	disLikesCount: 4242,
	postedAt: '2023-09-29',
	videoUrl: 'jghjg',
	views: 4205345345,
	nextVideoId: 'sg4t3ct32ag',
	qualities: ['144p', '240p', '360p', '480p', '720p', '1080p', '1440p', '2160p'],
	thumbnailUrl: '',
	duration: 9000,
	channel: {
		name: 'Bones - тема',
		profileImageUrl: 'https://yt3.ggpht.com/odyoGI3JugwocJD-Nmw64lzDgngCJctgDKOM750RuIlIu759W7Cir9BJprZwaEsHmmIZTjU6Oa8=s48-c-k-c0x00ffffff-no-rj',
		subscribersCount: 10000,
		id: '43434343'
	}
}

const defaultComments: IComment[] = [
	{
		'id': '1',
		'message': 'Дуже цікаве відео! Дякую за те, що поділились.',
		'createdAt': '2024-02-03T22:49:00.000Z',
		'likesCount': 10,
		'disLikesCount': 0,
		'chanel': {
			'id': 'channel-1',
			'name': 'Наука та Технології',
			'profileImageUrl': 'https://yt3.ggpht.com/ytc/AIf8zZTx3AsZckgO7PrxzDER6nPqydPP_EsO6XIxoRWxHg=s48-c-k-c0x00ffffff-no-rj',
			'subscribersCount': 10000
		}
	},
	{
		'id': '2',
		'message': 'Чудовий канал! Завжди знаходжу тут багато корисної інформації.',
		'createdAt': '2024-02-03T22:50:00.000Z',
		'likesCount': 5,
		'disLikesCount': 0,
		'chanel': {
			'id': 'channel-2',
			'name': 'Кулінарія',
			'profileImageUrl': 'https://yt3.ggpht.com/bM56yGtmL91Ks0iQoKtuVxDGXBxqlOcJFXbNgAGieneif3kVGefYulz4gr3RBN-5XMvfHUDP3Q=s48-c-k-c0x00ffffff-no-rj',
			'subscribersCount': 5000
		}
	},
	{
		'id': '3',
		'message': 'Не згоден з автором відео. На мою думку, він помиляється.',
		'createdAt': '2024-02-03T22:51:00.000Z',
		'likesCount': 2,
		'disLikesCount': 1,
		'chanel': {
			'id': 'channel-3',
			'name': 'Подорожі',
			'profileImageUrl': 'https://yt3.ggpht.com/uuuDF5kog8igvdBOJcXjfTD2F059JI19ItkriqAlayoc3RRIUswwYPHZGWHJqZvanRaBa9bS8w=s48-c-k-c0x00ffffff-no-rj',
			'subscribersCount': 2000
		}
	},
	{
		'id': '4',
		'message': 'Дуже емоційне відео. Не очікував такого.',
		'createdAt': '2024-02-03T22:52:00.000Z',
		'likesCount': 3,
		'disLikesCount': 0,
		'chanel': {
			'id': 'channel-4',
			'name': 'Музика',
			'profileImageUrl': 'https://yt3.ggpht.com/CodCq1P96PEMlEOz3VigJnJy3Jsq8JUoDOKEhrmC6WN0W-yUNgymV5mrXG-iKFRmm6JgYB02GA=s48-c-k-c0x00ffffff-no-rj',
			'subscribersCount': 3000
		}
	},
	{
		'id': '5',
		'message': 'Супер! ',
		'createdAt': '2024-02-03T22:53:00.000Z',
		'likesCount': 4,
		'disLikesCount': 0,
		'chanel': {
			'id': 'channel-5',
			'name': 'Спорт',
			'profileImageUrl': 'https://yt3.ggpht.com/r5xAvOWzSZOExIfJ4J7pd7rQC_TC8M2kGu_TDZAPQiUtUkT3K08CXPN1mVqk3EP28TGp0G3W=s48-c-k-c0x00ffffff-no-rj',
			'subscribersCount': 4000
		}
	}
]

const reportReasons: IReportReason[] = [
	{ id: 1, name: 'Контент сексуального характеру' },
	{ id: 2, name: 'Насильство або відразливі сцени' },
	{ id: 3, name: 'Ненависницький і образливий контент' },
	{ id: 4, name: 'Агресивні дії або залякування' },
	{ id: 5, name: 'Шкідливі або небезпечні дії' },
	{ id: 6, name: 'Інформація, що вводить в оману' },
	{ id: 7, name: 'Жорстоке поводження з дітьми' },
	{ id: 8, name: 'Пропаганда тероризму' },
	{ id: 9, name: 'Спам або оманливий контент' },
	{ id: 10, name: 'Правова проблема' }
]


export { videoSpeeds, defaultVideo, defaultComments , reportReasons}