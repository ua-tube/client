import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn, getChannelUrl } from '@/utils'
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
	Button,
	DynamicIcon
} from '@/components'
import { defaultChannel } from '@/data'


const profileFormSchema = z.object({
	username: z
		.string()
		.min(2, {
			message: 'Мінімальна довжина нікнейму 2 символи!'
		})
		.max(30, {
			message: 'Максимальна довжина нікнейму 30 символів!'
		}),
	name: z
		.string()
		.min(4, {
			message: 'Мінімальна довжина імені 4 символи!'
		})
		.max(30, {
			message: 'Максимальна довжина імені 30 символів!'
		}),
	description: z.string().max(320, {
		message: 'Максимальна довжина опису 320 символів!'
	}),
	urls: z
		.array(
			z.object({
				name: z.string().min(2, { message: 'Мінімальна довжина назви посилання 2 символи' }),
				value: z.string().url({ message: 'Введіть посилання!' })
			})
		)
		.optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
	description: defaultChannel.description,
	name: defaultChannel.name,
	username: defaultChannel.nickName,
	urls: [{name: 'Канал', value: getChannelUrl(defaultChannel.nickName, 'index', false)}]
}


const EditInfoTab: FC = () => {
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
		mode: 'onChange'
	})

	const { fields, append } = useFieldArray({
		name: 'urls',
		control: form.control
	})

	const onSubmit = (data: ProfileFormValues) => {
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Імя</FormLabel>
							<FormDescription>
								Виберіть назву каналу, що представлятиме вас і контент,
								який ви публікуєте. Ім’я можна змінювати двічі на 14 днів.
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
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Псевдонім</FormLabel>
							<FormDescription>
								Виберіть унікальний псевдонім, додавши літери й цифри.
								Ви зможете відновити попереднє ім’я користувача протягом
								14 днів. Псевдоніми можна змінювати двічі кожні 14 днів.
							</FormDescription>
							<FormControl>
								<Input placeholder="Введіть псевдонім" {...field} />
							</FormControl>
							<FormDescription
								children={getChannelUrl(form.getValues('username') as string,
									undefined, false)}
							/>
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
								Опишіть коротко діяльність вашого каналу, максимальна довжина опису каналу 320 символів.
							</FormDescription>
							<FormControl>
								<Textarea
									placeholder="Ваш опис..."
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div>
					{fields.map((field, index) => (
						<FormField
							control={form.control}
							key={field.id}
							name={`urls.${index}.value`}
							render={({ field }) => (
								<FormItem>
									<FormLabel className={cn(index !== 0 && 'sr-only')}>
										Посилання
									</FormLabel>
									<FormDescription className={cn(index !== 0 && 'sr-only')}>
										Додайте посилання на зовніші ресурси, або соц мережі.
									</FormDescription>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="mt-2"
						onClick={() => append({ value: '', name: '' })}
					>
						<DynamicIcon name="plus" className="mr-1 size-4" />
						Додати посилання
					</Button>
				</div>
				<Button type="submit">Оновити інформацію</Button>
			</form>
		</Form>
	)

}

export default EditInfoTab
