import { zodResolver } from '@hookform/resolvers/zod'
import { getImageUrl, toastError } from '@/utils'
import { VideoManagerService } from '@/services'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { FC, useEffect } from 'react'
import { IVideo } from '@/interfaces'
import { toast } from 'sonner'
import { z } from 'zod'
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Label,
	RadioGroup,
	RadioGroupItem,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea
} from '@/components'

interface IVideoEditTabProps {
	video?: IVideo
}

const VideoEditTab: FC<IVideoEditTabProps> = ({ video }) => {
	const { t } = useTranslation('studio')

	const videoFormSchema = z.object({
		title: z
			.string()
			.min(4, { message: t('minLength', { length: 4 }) })
			.max(120, { message: t('maxLength', { length: 120 }) }),
		description: z
			.string()
			.max(9999, { message: t('maxLength', { length: 9999 }) }),
		tags: z
			.string()
			.max(9999, { message: t('maxLength', { length: 9999 }) })
			.refine(
				value => (value ? /^(\s*\w+\s*,)*(\s*\w+\s*)$/.test(value) : true),
				{ message: t('tagsRule') }
			)
			.optional(),
		visibility: z.string(),
		thumbnailId: z.string()
	})

	const form = useForm<z.infer<typeof videoFormSchema>>({
		resolver: zodResolver(videoFormSchema),
		mode: 'onSubmit'
	})

	useEffect(() => {
		if (video) {
			form.setValue('title', video.title)
			form.setValue('tags', video.tags?.join(',') || '')
			form.setValue('description', video.description || '')
			form.setValue('visibility', video.visibility!)
			form.setValue(
				'thumbnailId',
				video?.thumbnailId || video.thumbnails?.at(1)?.imageFileId || ''
			)
		}
	}, [video])

	const onSubmit = async ({
		thumbnailId,
		...props
	}: z.infer<typeof videoFormSchema>) => {
		try {
			await VideoManagerService.updateVideo(
				video?.id!,
				(thumbnailId ? { thumbnailId, ...props } : props) as any
			)
			toast.success(t('updateSucc'))
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
							<FormLabel>{t('title.title')}</FormLabel>
							<FormDescription>{t('title.desc')}</FormDescription>
							<FormControl>
								<Input {...field} />
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
							<FormLabel>{t('desc.title')}</FormLabel>
							<FormDescription>{t('desc.desc')}</FormDescription>
							<FormControl>
								<Textarea rows={5} {...field} />
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
							<FormLabel>{t('tags.title')}</FormLabel>
							<FormDescription>{t('tags.desc')}</FormDescription>
							<FormControl>
								<Textarea
									placeholder={t('tags.placeholder')}
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
							<FormLabel>{t('visibility.title')}</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue
											placeholder={`Виберіть видимість.. (${field.value})`}
										/>
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value='Private'>
										{t('visibility.private')}
									</SelectItem>
									<SelectItem value='Unlisted'>
										{t('visibility.unlisted')}
									</SelectItem>
									<SelectItem value='Public'>
										{t('visibility.private')}
									</SelectItem>
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
							<FormLabel>{t('videoPhoto.title')}</FormLabel>
							<FormDescription>{t('videoPhoto.desc')}</FormDescription>
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
				<Button type='submit'>{t('update')}</Button>
			</form>
		</Form>
	)
}

export default VideoEditTab
