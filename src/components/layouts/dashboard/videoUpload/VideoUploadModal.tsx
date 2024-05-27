import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseState } from '@/interfaces'
import { FC, useState } from 'react'
import { z } from 'zod'
import {
	Dialog,
	DialogContent,
	Input,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Button,
	Form,
	Textarea,
	DialogHeader,
	DialogTitle,
	Label,
	DynamicIcon,
	FormDescription
} from '@/components'
import { toastError } from '@/utils'
import { VideoManagerService, StorageService } from '@/services'
import { useRouter } from 'next/router'

interface IVideoUploadModalProps {
	showModal: boolean
	setShowModal: UseState<boolean>
}

const FormSchema = z.object({
	title: z.string().min(
		2,
		{ message: 'Мінімальна довжина 2 символи!' }
	),
	description: z
		.string()
		.max(
			9999,
			{ message: 'Максимальна довжина 9999 символів.' }
		)
})

const VideoUploadModal: FC<
	IVideoUploadModalProps
> = ({
			 setShowModal,
			 showModal
		 }) => {
	const { replace } = useRouter()

	const [video, setVideo] = useState<File>()
	const [loading, setLoading] = useState<boolean>(false)

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { description: '', title: '' }
	})

	const onSubmit = async (videoCreateForm: z.infer<typeof FormSchema>) => {
		setLoading(true)

		try {
			const { data } = await VideoManagerService.createNewVideo(videoCreateForm)

			const { data: { token } } = await VideoManagerService.getVideoUploadToken(data.id)

			const formData = new FormData()
			formData.append('file', video!)
			await StorageService.uploadVideo(formData, token)
			setLoading(false)

			setTimeout(_ => {
				setVideo(undefined)
				setShowModal(false)
				replace('/dashboard/videos')
			}, 200)

		} catch (e) {
			toastError(e)
		}
		setLoading(false)
	}

	return <Dialog open={showModal} onOpenChange={setShowModal}>
		<DialogContent className="sm:max-w-md">
			<DialogHeader>
				<DialogTitle className="text-center">Створення нового відео</DialogTitle>
			</DialogHeader>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
					<FormField
						control={form.control}
						name="title"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Назва відео</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Опис для відео</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Опис..."
										className="resize-none"
										{...field}
									/>
								</FormControl>
								<FormDescription>
									Напишіть мінімальний опис його потім можна буде змінити, в меню редагування відео.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Label htmlFor="file">Відео файл</Label>
					<Input
						id="file"
						type="file"
						accept="video/mp4,video/x-m4v,video/*"
						onChange={e => setVideo(e.target.files?.[0])}
					/>
					<FormDescription>
						Підтримуються лише формати, які використовуються в відео.
					</FormDescription>
					<Button
						type="submit"
						className="w-full flex flex-row items-center gap-2"
						disabled={!video || loading}
					>
						{loading && (<DynamicIcon className="animate-spin size-4" name="loader" />)}
						<span>Завантажити</span>
					</Button>
				</form>
			</Form>

		</DialogContent>
	</Dialog>

}

export default VideoUploadModal
