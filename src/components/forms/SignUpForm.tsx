import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslation } from 'next-i18next'
import { useForm } from 'react-hook-form'
import { ICreator } from '@/interfaces'
import { toastError } from '@/utils'
import { FC, useState } from 'react'
import { useActions } from '@/hooks'
import Link from 'next/link'
import { z } from 'zod'
import { AuthService, CreatorService, StorageService, UserService } from '@/services'
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	DynamicIcon,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Label
} from '@/components'

const checkNicknameAvailability = async (s: string): Promise<boolean> => {
	try {
		const {
			data: { availability }
		} = await UserService.checkNicknameAvailable(s)
		return availability
	} catch (error) {
		return false
	}
}

const SignUpForm: FC = () => {
	const { t } = useTranslation('auth')

	const { signUp } = useActions()
	const [loading, setLoading] = useState<boolean>(false)
	const [image, setImage] = useState<File>()

	const AuthFormSchema = z.object({
		email: z.string().email({ message: t('incorrectEmail') }),
		password: z.string().min(8, { message: t('minPassLength') }),
		displayName: z.string().min(2).max(128),
		nickname: z
			.string()
			.min(3)
			.max(16)
			.refine(async nickname => checkNicknameAvailability(nickname), {
				message: t('nicknameAlreadyUsed')
			})
	})

	const authForm = useForm<z.infer<typeof AuthFormSchema>>({
		resolver: zodResolver(AuthFormSchema),
		defaultValues: { email: '', password: '' }
	})

	const onSubmit = async ({
		displayName,
		nickname,
		password,
		email
	}: z.infer<typeof AuthFormSchema>) => {
		setLoading(true)

		try {
			const { data: userData } = await AuthService.signup({ email, password })
			let creator: ICreator

			const { data } = await CreatorService.createCreator(
				{ displayName, nickname },
				userData.accessToken
			)
			creator = data

			if (image) {
				const {
					data: { token }
				} = await UserService.generateThumbnailToken(userData.accessToken)

				const formData = new FormData()
				formData.append('file', image!)

				const { data: imageData } = await StorageService.uploadImage(
					formData,
					token,
					userData.accessToken
				)

				const { data: updatedCreator } = await CreatorService.updateCreator(
					{ thumbnailToken: imageData.token, nickname, displayName },
					userData.accessToken
				)
				creator = updatedCreator
			}

			setLoading(false)

			signUp({ ...userData, user: { ...userData.user, creator } })
		} catch (e) {
			setLoading(false)
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
				<CardDescription>{t('registerNewAccount')}</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...authForm}>
					<form
						onSubmit={authForm.handleSubmit(onSubmit)}
						className='space-y-3'
					>
						<FormField
							control={authForm.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('yourEmail')}</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='name@example.com'
											{...field}
										/>
									</FormControl>
									<FormDescription>{t('getEmailReason')}</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={authForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('password')}</FormLabel>
									<FormControl>
										<Input type='password' placeholder='*********' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={authForm.control}
							name='displayName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('displayName')}</FormLabel>
									<FormControl>
										<Input type='text' {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={authForm.control}
							name='nickname'
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t('username')}</FormLabel>
									<FormControl>
										<Input type='text' maxLength={16} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Label htmlFor='file'>{t('profilePhoto')}</Label>
						<Input
							id='file'
							type='file'
							accept='image/*'
							onChange={e => setImage(e.target.files?.[0])}
						/>

						<Button
							type='submit'
							className='w-full flex flex-row items-center gap-2'
						>
							{loading && (
								<DynamicIcon className='animate-spin size-4' name='loader' />
							)}
							<span>{t('register')}</span>
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='justify-between text-muted-foreground'>
				<Link href='/auth/sign-in' children={t('alreadyHaveAccount')} />
				<Link href='/auth/recovery' children={t('notRememberYourPass')} />
			</CardFooter>
		</Card>
	)
}

export default SignUpForm
