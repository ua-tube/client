import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { getChannelUrl, toastError } from '@/utils'
import { useAuth, useActions } from '@/hooks'
import { FC } from 'react'
import { z } from 'zod'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Input,
	FormDescription,
	FormMessage,
	Textarea,
	Button
} from '@/components'
import { CreatorService } from '@/services'
import { toast } from 'sonner'

const profileFormSchema = z.object({
	nickname: z
		.string()
		.min(2, {
			message: 'Мінімальна довжина нікнейму 2 символи!'
		})
		.max(30, {
			message: 'Максимальна довжина нікнейму 30 символів!'
		}),
	displayName: z
		.string()
		.min(4, {
			message: 'Мінімальна довжина імені 4 символи!'
		})
		.max(30, {
			message: 'Максимальна довжина імені 30 символів!'
		}),
	email: z.string().email({ message: 'Не вірний тип емайлу!' }),
	description: z.string().max(9999, {
		message: 'Максимальна довжина опису 9999 символів!'
	})
})


const EditInfoTab: FC = () => {
	const { user } = useAuth()
	const { updateCreator } = useActions()

	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			description: user?.creator.description ?? '',
			displayName: user?.creator.displayName,
			email: user?.email,
			nickname: user?.creator.nickname
		},
		mode: 'onSubmit'
	})


	const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
		try {
			const { data: creator } = await CreatorService.updateCreator(data)
			updateCreator(creator)
			toast.success('Оновлено успішно!')
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="displayName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Імя</FormLabel>
							<FormDescription>
								Виберіть назву каналу, що представлятиме вас і контент, який ви
								публікуєте.
							</FormDescription>
							<FormControl>
								<Input placeholder="Введіть назву каналу" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="nickname"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Псевдонім</FormLabel>
							<FormDescription>
								Виберіть унікальний псевдонім, додавши літери й цифри.
							</FormDescription>
							<FormControl>
								<Input placeholder="Введіть псевдонім" {...field} />
							</FormControl>
							<FormDescription children={getChannelUrl(form.getValues('nickname') as string, undefined, false)} />
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Емайл</FormLabel>
							<FormDescription>
								Введіть емайл для зв'язку з вами.
							</FormDescription>
							<FormControl>
								<Input placeholder="Введіть email" {...field} />
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
							<FormLabel>Опис</FormLabel>
							<FormDescription>
								Коротко опишіть діяльність вашого каналу.
							</FormDescription>
							<FormControl>
								<Textarea placeholder="Ваш опис..." {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Оновити інформацію</Button>
			</form>
		</Form>
	)
}

export default EditInfoTab
