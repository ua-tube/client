import { zodResolver } from '@hookform/resolvers/zod'
import { VideoManagerService } from '@/services'
import { useForm } from 'react-hook-form'
import { UseState } from '@/interfaces'
import { useRouter } from 'next/router'
import { toastError } from '@/utils'
import { FC } from 'react'
import { z } from 'zod'
import {
	Button,
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea
} from '@/components'

interface IVideoCreateModalProps {
	showModal: boolean
	setShowModal: UseState<boolean>
}

const FormSchema = z.object({
	title: z.string().min(2, { message: 'Мінімальна довжина 2 символи!' }),
	description: z
		.string()
		.max(9999, { message: 'Максимальна довжина 9999 символів.' })
})

const VideoCreateModal: FC<IVideoCreateModalProps> = ({
	setShowModal,
	showModal
}) => {
	const { replace } = useRouter()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { description: '', title: '' }
	})

	const onSubmit = async (videoCreateForm: z.infer<typeof FormSchema>) => {
		try {
			await VideoManagerService.createNewVideo(videoCreateForm)
			await replace('/dashboard/videos')
			setShowModal(false)
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<Dialog open={showModal} onOpenChange={setShowModal}>
			<DialogContent className='sm:max-w-md'>
				<DialogHeader>
					<DialogTitle className='text-center'>
						Створення нового відео
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Назва відео</FormLabel>
									<FormControl>
										<Input type='text' {...field} />
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
									<FormLabel>Опис для відео</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Опис...'
											className='resize-none'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										Напишіть мінімальний опис його потім можна буде змінити, в
										меню редагування відео.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							className='w-full flex flex-row items-center gap-2'
						>
							<span>Створити нове відео</span>
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default VideoCreateModal
