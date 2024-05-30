import { Avatar, Button, Input, AvatarImage, AvatarFallback } from '@/components'
import { CreatorService, UserService, StorageService } from '@/services'
import { toastError, getImageUrl, getUserInitials } from '@/utils'
import { FC, useState, useEffect } from 'react'
import { useAuth, useActions } from '@/hooks'
import { ICreator } from '@/interfaces'


const EditImagesTab: FC = () => {
	const { user, accessToken } = useAuth()
	const { updateCreator } = useActions()
	const [data, setData] = useState<ICreator>()

	const [image, setImage] = useState<File>()
	const [bannerImage, setBannerImage] = useState<File>()


	const updateData = async () => {
		try {
			const { data } = await CreatorService.getCreatorBySelf()
			setData(data)
		} catch (e) {
			toastError(e)
		}
	}

	useEffect(() => {
		(async () => updateData())()
	}, [])


	const onThumbnailUpdate = async () => {
		try {

			const { data: { token } } = await UserService.generateThumbnailToken()

			const formData = new FormData()
			formData.append('file', image!)

			const { data: imageData } = await StorageService.uploadImage(formData, token, accessToken!)

			const { data: creator } = await CreatorService.updateCreator(
				{ thumbnailToken: imageData.token, nickname: data?.nickname, displayName: data?.displayName },
				accessToken
			)

			await updateData()

			setImage(undefined)

			updateCreator(creator)

		} catch (e) {
			toastError(e)
		}
	}

	const onBannerUpdate = async () => {
		try {

			const { data: { token } } = await UserService.generateBannerToken()

			const formData = new FormData()
			formData.append('file', bannerImage!)

			const { data: imageData } = await StorageService.uploadImage(formData, token, accessToken!)

			const { data: creator } = await CreatorService.updateCreator(
				{ bannerToken: imageData.token, nickname: data?.nickname, displayName: data?.displayName },
				accessToken
			)

			await updateData()

			setBannerImage(undefined)

			updateCreator(creator)

		} catch (e) {
			toastError(e)
		}
	}

	return (
		<div className="space-y-2">
			<div>
				<h2>Зображення</h2>
				<p className="text-sm text-muted-foreground">
					Зображення профілю – це значок каналу, що відображається біля ваших
					відео й коментарів на UaTube.
				</p>
				<div className="flex flex-col md:flex-row gap-4 items-start py-2">
					<div className="h-52 w-80 bg-muted rounded-lg flex items-center justify-center">
						<Avatar className="size-48">
							<AvatarImage src={getImageUrl(data?.thumbnailUrl)} />
							<AvatarFallback children={getUserInitials(data?.displayName)} />
						</Avatar>
					</div>
					<div className="w-1/3 space-y-2">
						<p className="flex max-w-md text-sm">
							Радимо використовувати зображення розміром принаймні 98 x 98
							пікселів (розмір файлу – до 4 МБ) у форматі PNG або GIF (без
							анімації).
						</p>
						<div className="flex items-center gap-1">
							<Input
								id="file"
								type="file"
								accept="image/*"
								onChange={e => setImage(e.target.files?.[0])}
							/>
							<Button
								children="Оновити"
								variant="secondary"
								disabled={!image}
								onClick={onThumbnailUpdate}
							/>
						</div>
					</div>
				</div>
			</div>

			<div>
				<h2>Зображення банера</h2>
				<p className="text-sm text-muted-foreground">
					Банер буде розташовано вгорі сторінки вашого каналу.
				</p>
				<div className="flex flex-col md:flex-row gap-4 items-start py-2">
					<div className="h-52 w-80 bg-muted rounded-lg flex items-center justify-center">
						<div className="space-y-2 flex flex-col items-center">
							<img
								src={getImageUrl(data?.bannerUrl)}
								className="w-72 object-cover h-9 rounded-lg"
								alt="profile-img-1"
							/>
							<img
								src={getImageUrl(data?.bannerUrl)}
								className="w-48 object-cover h-6 rounded-lg"
								alt="profile-img-2"
							/>
							<img
								src={getImageUrl(data?.bannerUrl)}
								className="w-24 object-cover h-3 rounded-md"
								alt="profile-img-3"
							/>
						</div>
					</div>
					<div className="w-1/3 space-y-2">
						<p className="flex max-w-md text-sm">
							Щоб банер мав гарний вигляд на всіх пристроях, використовуйте
							зображення розміром принаймні 2028 x 1152 пікселів (розмір файлу –
							до 5 МБ).
						</p>
						<div className="flex items-center gap-1">
							<Input
								id="file"
								type="file"
								accept="image/*"
								onChange={e => setBannerImage(e.target.files?.[0])}
							/>
							<Button children="Оновити" variant="secondary" disabled={!bannerImage} onClick={onBannerUpdate} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default EditImagesTab
