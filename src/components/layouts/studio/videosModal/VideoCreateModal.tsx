import { zodResolver } from '@hookform/resolvers/zod'
import { VideoManagerService } from '@/services'
import { useTranslation } from 'next-i18next'
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

const VideoCreateModal: FC<IVideoCreateModalProps> = ({
	setShowModal,
	showModal
}) => {
	const { t } = useTranslation('studio')
	const { replace } = useRouter()

	const FormSchema = z.object({
		title: z
			.string()
			.min(2, { message: t('minLength', { length: 2 }) })
			.max(120, { message: t('maxLength', { length: 120 }) }),
		description: z
			.string()
			.max(9999, { message: t('maxLength', { length: 9999 }) })
	})

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { description: '', title: '' }
	})

	const onSubmit = async (videoCreateForm: z.infer<typeof FormSchema>) => {
		try {
			await VideoManagerService.createNewVideo(videoCreateForm)
			await replace('/studio/videos')
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
						{t('creatingNewVideo')}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<FormField
							control={form.control}
							name='title'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('title.title')}</FormLabel>
									<FormControl>
										<Input type='text' {...field} />
									</FormControl>
									<FormDescription>{t('title.desc')}</FormDescription>
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
									<FormControl>
										<Textarea className='resize-none' {...field} />
									</FormControl>
									<FormDescription>{t('desc.desc')}</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type='submit'
							className='w-full flex flex-row items-center gap-2'
						>
							<span>{t('creatingNewVideo')}</span>
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default VideoCreateModal
