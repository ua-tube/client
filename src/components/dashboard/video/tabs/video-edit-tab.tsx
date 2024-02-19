import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { defaultVideo } from '@/data'
import { FC, useState } from 'react'
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
	Label,
	DynamicIcon,
	HoverCardContent,
	HoverCard,
	HoverCardTrigger
} from '@/components'


const profileFormSchema = z.object({
	title: z
		.string()
		.min(4, {
			message: 'Мінімальна довжина заголовку 4 символи!'
		})
		.max(30, {
			message: 'Максимальна довжина заголовку 30 символів!'
		}),
	description: z.string().max(1000, {
		message: 'Максимальна довжина опису 1000 символів!'
	}),
	visible: z.string().optional(),
	thumbnailImg: z.string().optional()
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

const defaultValues: Partial<ProfileFormValues> = {
	title: defaultVideo.title,
	description: defaultVideo.description,
	visible: '0',
	thumbnailImg: '0'
}

const previewImages = [
	'https://i.pinimg.com/236x/de/78/35/de78357d7c2f26afb0e6a82ddbb8a161.jpg',
	'https://i.pinimg.com/236x/db/96/d6/db96d6a89f37c3f25dbe576406514dee.jpg',
	'https://i.pinimg.com/236x/16/a7/51/16a75179afe67ef2aa17f01b481dd21f.jpg'
]


const VideoEditTab: FC = () => {
	const [customFile, setCustomFile] = useState<any>()

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
		mode: 'onChange'
	})

	const onSubmit = (data: ProfileFormValues) => {
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Імя</FormLabel>
							<FormDescription>
								Приваблива назва допоможе зацікавити глядачів.
								Додайте в назви відео ключові слова, якими
								може користуватися ваша аудиторія, шукаючи подібний вміст.
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
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Опис</FormLabel>
							<FormDescription>
								Описи з ключовими словами допомагають глядачам знаходити ваші відео через пошук.
								Напишіть, про що ваше відео, використовуючи ключові слова на початку опису.
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
				<FormField
					control={form.control}
					name="visible"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Видимість</FormLabel>
							<Select onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger>
										<SelectValue placeholder="Виберіть видимість.." />
									</SelectTrigger>
								</FormControl>
								<SelectContent>
									<SelectItem value="0">Приватне</SelectItem>
									<SelectItem value="1">Не для всіх</SelectItem>
									<SelectItem value="2">Для всіх</SelectItem>
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="thumbnailImg"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Обкладинка відео</FormLabel>
							<FormDescription>
								Виберіть або завантажте зображення, яке показує,
								про що йдеться у вашому відео. Вдало підібрана
								обкладинка виділяється й привертає увагу глядачів
							</FormDescription>
							<FormControl>
								<RadioGroup className="grid grid-cols-4 gap-3" onValueChange={field.onChange}>
									<div>
										<RadioGroupItem value="0" id="0" className="peer sr-only" disabled={!customFile} />
										<Label
											htmlFor="0"
											className="flex flex-col items-center justify-center size-full rounded-md border-2 border-muted bg-popover p-0.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
											children={!customFile ?
												<HoverCard>
													<HoverCardTrigger className="flex flex-col items-center justify-center">
														<DynamicIcon
															name="image-plus"
															className="mb-4 size-6"
														/>
														<p>Додати обкладинку відео</p>
													</HoverCardTrigger>
													<HoverCardContent>
														<Input
															type="file"
															accept="image/*"
															onChange={e => setCustomFile(e.target.files?.[0])}
														/>
													</HoverCardContent>
												</HoverCard> :
												<div className="relative group aspect-video">
													<img
														className="relative object-contain aspect-video h-28"
														src={URL.createObjectURL(customFile)}
														alt="0"
													/>
													<div
														className="absolute bottom-0 right-0 size-full opacity-0 group-hover:opacity-100"
													>
														<Button
															variant="destructive"
															onClick={() => setCustomFile(undefined)}
															children={<DynamicIcon name="trash" />}
														/>
													</div>
												</div>
											}
										/>
									</div>
									{previewImages.map((value, index) => <div key={index}>
											<RadioGroupItem value={`${index + 1}`} id={`${index + 1}`} className="peer sr-only" />
											<Label
												htmlFor={`${index + 1}`}
												className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-0.5 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
											>
												<img src={value} alt="1" />
											</Label>
										</div>
									)}
								</RadioGroup>
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

export default VideoEditTab
