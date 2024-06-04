import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ICreatePlaylistsRequest } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'next-i18next'
import { LibraryService } from '@/services'
import { toastError } from '@/utils'
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Textarea
} from '@/components'

interface IPlaylistCreateFormProps {
	onFinish?: () => Promise<void>
	videoId?: string
}

const createPlaylistSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	visibility: z.enum(['Private', 'Unlisted', 'Public'])
})

const PlaylistCreateForm: FC<IPlaylistCreateFormProps> = ({
	onFinish,
	videoId
}) => {
	const { t } = useTranslation('playlist')
	const form = useForm<ICreatePlaylistsRequest>({
		resolver: zodResolver(createPlaylistSchema),
		defaultValues: { visibility: 'Private' }
	})

	const onSubmit = async (request: ICreatePlaylistsRequest) => {
		try {
			const { data } = await LibraryService.createPlaylist(request)
			toast.success(t(`playlistCreatedSucc`, { title: request.title }))
			if (videoId) {
				await LibraryService.addItemToPlaylist({ videoId, t: data.id })
				toast.success(t(`videoAddedToListSucc`, { title: request.title }))
			}
			onFinish && (await onFinish())
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
							<FormLabel>{t('title')}</FormLabel>
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
							<FormLabel>{t('shortDesc.title')}</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormDescription>{t('shortDesc.desc')}</FormDescription>
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
							<FormControl>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder='Виберіть доступність відео' />
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
											{t('visibility.public')}
										</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>{t('visibility.desc')}</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>{t('saveToNewPlaylist')}</Button>
			</form>
		</Form>
	)
}

export default PlaylistCreateForm
