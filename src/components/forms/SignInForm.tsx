import { AuthService, CreatorService } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { useActions } from '@/hooks'
import { toastError } from '@/utils'
import { toast } from 'sonner'
import Link from 'next/link'
import { FC, useState } from 'react'
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
	Input,
	DynamicIcon
} from '@/components'

const SignInForm: FC = () => {

	const [loading, setLoading] = useState<boolean>(false)

	const { t } = useTranslation('auth')

	const { login } = useActions()

	const FormSchema = z.object({
		email: z.string().email({ message: t('incorrectEmail') }),
		password: z.string().min(8, { message: t('minPassLength') })
	})

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email: '', password: '' }
	})

	const onSubmit = async (data: z.infer<typeof FormSchema>) => {
		try {
			setLoading(true)
			const {
				data: { accessToken, user }
			} = await AuthService.login(data)

			const { data: creator } =
				await CreatorService.getCreatorBySelf(accessToken)

			toast.success('Успішний вхід!')
			login({ accessToken, user: { ...user, creator } })
			setLoading(false)
		} catch (e) {
			setLoading(false)
			toastError(e)
		}
	}

	return (
		<Card className="sm:min-w-[28rem] p-1">
			<CardHeader className="text-center">
				<CardTitle>
					<Link
						href="/public"
						className="flex space-x-1.5 items-center justify-center"
					>
						<img src="/logo.png" alt="logo" className="size-8" />
						<span className="font-semibold">UaTube</span>
					</Link>
				</CardTitle>
				<CardDescription>{t('loginToAccount')}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('yourEmail')}</FormLabel>
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
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('password')}</FormLabel>
									<FormControl>
										<Input type="password" placeholder="*********" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type="submit" className="w-full flex flex-row items-center gap-2">
							{loading && (<DynamicIcon className="animate-spin size-4" name="loader" />)}
							<span>{t('login')}</span>
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="justify-between text-muted-foreground">
				<Link href="/auth/sign-up" children={t('alreadyDontHaveAccount')} />
				<Link href="/auth/recovery" children={t('notRememberYourPass')} />
			</CardFooter>
		</Card>
	)
}

export default SignInForm
