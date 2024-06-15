import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { AuthService } from '@/services'
import { useRouter } from 'next/router'
import { toastError } from '@/utils'
import { toast } from 'sonner'
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

interface IRecoveryPassFormProps {
	email?: string
	token?: string
}

const RecoveryPassForm: FC<IRecoveryPassFormProps> = ({ token, email }) => {
	const { t } = useTranslation('auth')

	const { replace } = useRouter()

	const FormSchema = z.object({
		newPassword: z.any(),
		...(!token && { email: z.string().email({ message: t('incorrectEmail') }) })
	})

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: { email: '', newPassword: '' }
	})

	const onSubmit = async (values: z.infer<typeof FormSchema>) => {
		try {
			if (token && email) {
				const { data } = await AuthService.passReset({
					newPassword: values.newPassword,
					token,
					email
				})
				if (data.code === 201)
					replace ('/auth/login')
				toast.success(t('succRecoverPass'))
			} else {
				await AuthService.recoveryPass({
					email: (values.email as string) || email!
				})
				toast.success(t('recoveryEmailSend'))
			}
		} catch (e) {
			toastError(e)
		}
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
				<CardDescription>{t('recoverAccessToAccount')}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
						<FormField
							control={form.control}
							name='email'
							disabled={!!token}
							render={(f: any) => (
								<FormItem>
									<FormLabel>{t('email')}</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='name@example.com'
											{...f.field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						{token && (
							<FormField
								control={form.control}
								name='newPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>{t('newPassword')}</FormLabel>
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
						)}
						<Button type='submit' className='w-full'>
							{t('send')}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='justify-between text-muted-foreground'>
				<Link href='/auth/sign-in' children={t('alreadyHaveAccount')} />
				<Link href='/auth/sign-up' children={t('alreadyDontHaveAccount')} />
			</CardFooter>
		</Card>
	)
}

export default RecoveryPassForm
