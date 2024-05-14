import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { UseState } from '@/interfaces'
import { FC } from 'react'
import { z } from 'zod'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
	Select,
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
	Button
} from '@/components'

interface IFiltersModalProps {
	open: boolean
	setOpen: UseState<boolean>
}

const FormSchema = z.object({
	filterDate: z.string().optional(),
	timeLimit: z.string().optional(),
	sort: z.string().optional(),
	type: z.string().optional()
})

const FiltersModal: FC<IFiltersModalProps> = ({ setOpen, open }) => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema)
	})

	function onSubmit(data: z.infer<typeof FormSchema>) {}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Фільтри пошуку</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<FormField
							control={form.control}
							name='filterDate'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Дата завантаження</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Дата завантаження' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='hour'>Остання година</SelectItem>
											<SelectItem value='day'>Сьогодні</SelectItem>
											<SelectItem value='week'>Цього тиждня</SelectItem>
											<SelectItem value='month'>Цього місяця</SelectItem>
											<SelectItem value='year'>Цього року</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='type'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Тип контенту</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Виберіть тип' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='video'>Відео</SelectItem>
											<SelectItem value='channel'>Канал</SelectItem>
											<SelectItem value='playlist'>
												Список відтворення
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='timeLimit'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Тривалість відео</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Виберіть тривалість' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='4'>До 4 хвилин</SelectItem>
											<SelectItem value='4-20'>4 - 20 хвилин</SelectItem>
											<SelectItem value='20'>Понад 20 хвилин</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='sort'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Сортування</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder='Виберіть сортування' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='relative'>Відповідність</SelectItem>
											<SelectItem value='upload_date'>Найновіші</SelectItem>
											<SelectItem value='viewsCount'>Найстаріші</SelectItem>
											<SelectItem value='rating'>Найстаріші</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full'>
							Зберегти фільтри
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default FiltersModal
