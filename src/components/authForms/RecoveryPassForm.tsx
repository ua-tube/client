import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import { FC } from 'react'
import { z } from 'zod'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Input,
	FormMessage,
	Button,
	CardFooter
} from '@/components'

const FormSchema = z.object({
	email: z.string().email({ message: 'Емайл не дійсний!' }),
	otp: z
		.string()
		.min(6, { message: 'Мінамальна довжина 6 символів' })
		.max(6, { message: 'Максимальна довжина 6 символів' })
		.nullable()
		.transform(value => value ?? NaN),
	newPassword: z
		.string()
		.min(8, { message: 'Мінімальна довжина паролю 8 символів!' })
		.max(16, { message: 'Максимальна довжина 16 символів' })
		.nullable()
		.transform(value => value ?? NaN)
})

const RecoveryPassForm: FC = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email: '', otp: '', newPassword: '' }
	})

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		console.log(data)
	}

	return (
		<Card className='sm:min-w-[28rem] p-1'>
			<CardHeader className='text-center'>
				<CardTitle>
					<Link
						href='/'
						className='flex space-x-1.5 items-center justify-center'
					>
						<img src='/logo.png' alt='logo' className='size-8' />
						<span className='font-semibold'>UaTube</span>
					</Link>
				</CardTitle>
				<CardDescription>Відновлення доступу до аккаунту</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ваш емайл</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='name@example.com'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{form.getValues('email') !== '' && (
							<>
								<FormField
									control={form.control}
									name='otp'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Код</FormLabel>
											<FormControl>
												<Input
													type='number'
													placeholder='Ваш код надісланий на пошту'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name='newPassword'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Новий пароль</FormLabel>
											<FormControl>
												<Input
													type='password'
													placeholder='*********'
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</>
						)}
						<Button type='submit' className='w-full'>
							Надіслати
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='justify-between text-muted-foreground'>
				<Link href='/auth/sign-in' children='Вже маєте аккаунт?' />
				<Link href='/auth/sign-up' children='Ще не маєте аккаунту?' />
			</CardFooter>
		</Card>
	)
}

export default RecoveryPassForm
