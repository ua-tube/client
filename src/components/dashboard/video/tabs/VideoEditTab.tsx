import { zodResolver } from '@hookform/resolvers/zod'
import { getImageUrl, toastError } from '@/utils'
import { VideoManagerService } from '@/services'
import { useForm } from 'react-hook-form'
import { FC, useEffect } from 'react'
import { IVideo } from '@/interfaces'
import { toast } from 'sonner'
import { z } from 'zod'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormDescription,
	FormControl,
	Input,
	FormMessage,
	Textarea,
	Button,
	Select,
	SelectValue,
	SelectTrigger,
	SelectContent,
	SelectItem,
	RadioGroup,
	RadioGroupItem,
	Label
} from '@/components'

interface IVideoEditTabProps {
	video?: IVideo
}

const videoFormSchema = z.object({
	title: z
		.string()
		.min(4, {
			message: 'Мінімальна довжина заголовку 4 символи!'
		})
		.max(60, {
			message: 'Максимальна довжина заголовку 30 символів!'
		}),
	description: z.string().max(9999, {
		message: 'Максимальна довжина опису 9999 символів!'
	}),
	tags: z
		.string()
		.max(9999, {
			message: 'Максимальна довжина тегів 9999 символів!'
		})
		.refine(value => /^(\s*\w+\s*,)*(\s*\w+\s*)$/.test(value), {
			message: 'Теги повинні бути введені через кому!'
		}),
	visibility: z.string(),
	thumbnailId: z.string()
})

const VideoEditTab: FC<IVideoEditTabProps> = ({ video }) => {
	const form = useForm<z.infer<typeof videoFormSchema>>({
		resolver: zodResolver(videoFormSchema),
		mode: 'onSubmit'
	})

	useEffect(() => {
		if (video) {
			form.setValue('title', video.title)
			form.setValue('tags', video.tags || '')
			form.setValue('description', video.description || '')
			form.setValue('visibility', video.visibility!)
			form.setValue('thumbnailId', video?.thumbnailId || video.thumbnails?.at(1)?.imageFileId || '')
		}
	}, [video])

	const onSubmit = async (data: z.infer<typeof videoFormSchema>) => {
		try {
			await VideoManagerService.updateVideo(video?.id!, data as any)
			toast.success('Оновлено успішно!')
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='title'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Заголовок</FormLabel>
							<FormDescription>
								Приваблива заголовок допоможе зацікавити глядачів. Додайте в
								назви відео ключові слова, якими може користуватися ваша
								аудиторія, шукаючи подібний вміст.
							</FormDescription>
							<FormControl>
								<Input placeholder='Введіть заголовок' {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Опис</FormLabel>
							<FormDescription>
								Описи допомагають глядачам краще розуміти про що саме дане
								відео, а також надають додаткову інформацію.
							</FormDescription>
							<FormControl>
								<Textarea placeholder='Ваш опис...' rows={5} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Ключові слова</FormLabel>
							<FormDescription>
								Ключові слова допомагають глядачам знаходити ваші відео через
								пошук. Напишіть основні ключові слова через кому, їх зашальна
								кількість обмежена.
							</FormDescription>
							<FormControl>
								<Textarea
									placeholder='Напишіть декілька ключових слів ...'
									rows={2}
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='visibility'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Видимість</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={`Виберіть видимість.. (${field.value})`}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='Private'>Приватне</SelectItem>
									<SelectItem value='Unlisted'>Не для всіх</SelectItem>
									<SelectItem value='Public'>Для всіх</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='thumbnailId'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Обкладинка відео</FormLabel>
							<FormDescription>
								Виберіть або завантажте зображення, яке показує, про що йдеться
								у вашому відео. Вдало підібрана обкладинка виділяється й
								привертає увагу глядачів
							</FormDescription>
							<FormControl>
								<RadioGroup
									className='grid grid-cols-4 gap-3'
									onValueChange={field.onChange}
									defaultValue={field.value}
									value={field.value}
								>
									{video?.thumbnails?.map((value, index) => (
										<div key={index}>
											<RadioGroupItem
												value={value.imageFileId}
												id={value.imageFileId}
												className='peer sr-only'
											/>
											<Label
												htmlFor={value.imageFileId}
												className='flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-0.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary'
											>
												<img
													src={getImageUrl(value.url)}
													alt={value.imageFileId}
													className='aspect-video object-cover'
												/>
											</Label>
										</div>
									))}
								</RadioGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Оновити інформацію</Button>
			</form>
		</Form>
	)
}

export default VideoEditTab
