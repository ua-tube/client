import { FC } from 'react'
import { Avatar, Button } from '@/components'

const EditImagesTab: FC = () => {
	return (
		<div className='space-y-2'>
			<div>
				<h2>Зображення</h2>
				<p className='text-sm text-muted-foreground'>
					Зображення профілю – це значок каналу, що відображається біля ваших
					відео й коментарів на UaTube.
				</p>
				<div className='flex flex-col md:flex-row gap-4 items-start py-2'>
					<div className='h-52 w-80 bg-muted rounded-lg flex items-center justify-center'>
						<Avatar className='size-48'>
							{/*<AvatarImage src={defaultChannel.profileImg} />*/}
							{/*<AvatarFallback children={getUserInitials(defaultChannel.name)} />*/}
						</Avatar>
					</div>
					<div className='w-1/3 space-y-2'>
						<p className='flex max-w-md text-sm'>
							Радимо використовувати зображення розміром принаймні 98 x 98
							пікселів (розмір файлу – до 4 МБ) у форматі PNG або GIF (без
							анімації). Пам'ятайте, що воно має відповідати правилам спільноти
							UaTube.
						</p>
						<div className='flex items-center gap-x-2'>
							<Button children='Змінити' variant='secondary' />
							<Button children='Вилучити' variant='secondary' />
						</div>
					</div>
				</div>
			</div>

			<div>
				<h2>Зображення банера</h2>
				<p className='text-sm text-muted-foreground'>
					Банер буде розташовано вгорі сторінки вашого каналу
				</p>
				<div className='flex flex-col md:flex-row gap-4 items-start py-2'>
					<div className='h-52 w-80 bg-muted rounded-lg flex items-center justify-center'>
						<div className='space-y-2 flex flex-col items-center'>
							{/*<img*/}
							{/*	src={defaultChannel.profileBgImg}*/}
							{/*	className='w-72 object-cover h-9 rounded-lg'*/}
							{/*	alt='profile-img'*/}
							{/*/>*/}
							{/*<img*/}
							{/*	src={defaultChannel.profileBgImg}*/}
							{/*	className='w-48 object-cover h-6 rounded-lg'*/}
							{/*	alt='profile-img'*/}
							{/*/>*/}
							{/*<img*/}
							{/*	src={defaultChannel.profileBgImg}*/}
							{/*	className='w-24 object-cover h-3 rounded-md'*/}
							{/*	alt='profile-img'*/}
							{/*/>*/}
						</div>
					</div>
					<div className='w-1/3 space-y-2'>
						<p className='flex max-w-md text-sm'>
							Щоб банер мав гарний вигляд на всіх пристроях, використовуйте
							зображення розміром принаймні 2028 x 1152 пікселів (розмір файлу –
							до 5 МБ).
						</p>
						<div className='flex items-center gap-x-2'>
							<Button children='Змінити' variant='secondary' />
							<Button children='Вилучити' variant='secondary' />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditImagesTab
