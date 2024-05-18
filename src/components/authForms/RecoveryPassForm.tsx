import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { AuthService } from '@/services'
import { useActions } from '@/hooks'
import { toastError } from '@/utils'
import { toast } from 'sonner'
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

interface IRecoveryPassFormProps {
	email?: string
	token?: string
}

const RecoveryPassForm: FC<
	IRecoveryPassFormProps
> = ({
			 token,
			 email
		 }) => {

	const { login } = useActions()

	const FormSchema = z.object({
		email: z.any(),
		newPassword: z.any()
	})

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email, newPassword: '' }
	})

	const onSubmit = async (values: z.infer<typeof FormSchema>) => {
		try {
			if (token && email) {
				const { data } = await AuthService.passReset({ ...values, token, email })
				if (data.statusCode === 201)
					login({ login: email!, password: values.newPassword as string })
				toast.success('Пароль відновлено успішно!')
			} else {
				await AuthService.recoveryPass({ email: values.email as string || email! })
				toast.success('Лист відновлення паролю відправлено успішно!')
			}
		} catch (e) {
			toastError(e)
		}
	}


	return (
		<Card className="sm:min-w-[28rem] p-1">
			<CardHeader className="text-center">
				<CardTitle>
					<Link
						href="/"
						className="flex space-x-1.5 items-center justify-center"
					>
						<img src="/logo.png" alt="logo" className="size-8" />
						<span className="font-semibold">UaTube</span>
					</Link>
				</CardTitle>
				<CardDescription>Відновлення доступу до аккаунту</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="email"
							disabled={!!token}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Ваш емайл</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="name@example.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{token && <FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Новий пароль</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="*********"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>}
						<Button type="submit" className="w-full">Надіслати</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="justify-between text-muted-foreground">
				<Link href="/auth/sign-in" children="Вже маєте аккаунт?" />
				<Link href="/auth/sign-up" children="Ще не маєте аккаунту?" />
			</CardFooter>
		</Card>
	)
}

export default RecoveryPassForm
