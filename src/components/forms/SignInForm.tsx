import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useActions } from '@/hooks'
import Link from 'next/link'
import { FC } from 'react'
import { z } from 'zod'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input
} from '@/components'

const FormSchema = z.object({
	email: z.string().email({ message: 'Емайл не дійсний!' }),
	password: z
		.string()
		.min(8, { message: 'Мінімальна довжина паролю 8 символів!' })
})

const SignInForm: FC = () => {
	const { login } = useActions()

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email: '', password: '' }
	})

	const onSubmit = (data: z.infer<typeof FormSchema>) => {
		login(data as any)
	}

	return (
		<Card className='sm:min-w-[28rem] p-1'>
			<CardHeader className='text-center'>
				<CardTitle>
					<Link
						href='/public'
						className='flex space-x-1.5 items-center justify-center'
					>
						<img src='/logo.png' alt='logo' className='size-8' />
						<span className='font-semibold'>UaTube</span>
					</Link>
				</CardTitle>
				<CardDescription>Вхід до аккаунту</CardDescription>
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
						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input type='password' placeholder='*********' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit' className='w-full'>
							Увійти
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='justify-between text-muted-foreground'>
				<Link href='/auth/sign-up' children='Ще не маєте аккаунту?' />
				<Link href='/auth/recovery' children='Забули ваш пароль?' />
			</CardFooter>
		</Card>
	)
}

export default SignInForm
