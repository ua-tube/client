import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { ICreatePlaylistsRequest } from '@/interfaces'
import { zodResolver } from '@hookform/resolvers/zod'
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
	const form = useForm<ICreatePlaylistsRequest>({
		resolver: zodResolver(createPlaylistSchema),
		defaultValues: { visibility: 'Private' }
	})

	const onSubmit = async (request: ICreatePlaylistsRequest) => {
		try {
			const { data } = await LibraryService.createPlaylist(request)
			toast.success(`Успішно створено новий плейліст "${request.title}"`)
			if (videoId) {
				await LibraryService.addItemToPlaylist({ videoId, t: data.id })
				toast.success(`Відео успішно додано в плейліст "${request.title}"`)
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
							<FormLabel>Назва</FormLabel>
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
							<FormLabel>Короткий опис</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormDescription>
								Напишіть короткий опис, який буде розповідати про основну суть
								вашого плейліста.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='visibility'
					render={({ field }) => (
						<FormItem>
							<FormLabel>Доступність плейліста</FormLabel>
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
										<SelectItem value='Private'>Приватний</SelectItem>
										<SelectItem value='Unlisted'>Не для всіх</SelectItem>
										<SelectItem value='Public'>Публічний</SelectItem>
									</SelectContent>
								</Select>
							</FormControl>
							<FormDescription>
								Виберіть доступність відео, за замовчуванням воно буде приватне.
							</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>Зберегти в новий плейліст</Button>
			</form>
		</Form>
	)
}

export default PlaylistCreateForm
