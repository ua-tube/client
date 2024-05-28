import { UserService, AuthService, CreatorService, StorageService } from '@/services'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toastError } from '@/utils'
import { useActions } from '@/hooks'
import Link from 'next/link'
import { z } from 'zod'
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	Input,
	FormDescription,
	FormMessage,
	Button,
	Form,
	DynamicIcon,
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

const AuthFormSchema = z.object({
	email: z.string().email({ message: 'Некоректний емайл!' }),
	password: z
		.string()
		.min(8, { message: 'Мінімальна дожина паролю 8 символів!' }),
	displayName: z.string().min(2).max(128),
	nickname: z
		.string()
		.min(3)
		.max(16)
		.refine(async nickname => checkNicknameAvailability(nickname), {
			message: 'This nickname is already taken'
		})
})

const SignUpForm: FC = () => {
	const { signUp } = useActions()
	const [loading, setLoading] = useState<boolean>(false)
	const [image, setImage] = useState<File>()

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

			await CreatorService.createCreator(
				{ displayName, nickname },
				userData.accessToken
			)

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

			const { data: creator } = await CreatorService.updateCreator(
				{ thumbnailToken: imageData.token, nickname, displayName },
				userData.accessToken
			)

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
				<CardDescription>Реєстрація нового аккаунту</CardDescription>
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
									<FormLabel>Ваш емайл</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='name@example.com'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										На емайл буде надіслано код підтвердження
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={authForm.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<Input type='password' placeholder='*********' {...field} />
									</FormControl>
									<FormDescription>
										Нe використовуйте простий пароль
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={authForm.control}
							name='displayName'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Імя вашого профілю</FormLabel>
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
									<FormLabel>Нікнейм вашого профілю</FormLabel>
									<FormControl>
										<Input type='text' maxLength={16} {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Label htmlFor='file'>Фото вашого профілю</Label>
						<Input
							id='file'
							type='file'
							accept='image/*'
							onChange={e => setImage(e.target.files?.[0])}
						/>

						<Button
							type='submit'
							className='w-full flex flex-row items-center gap-2'
							disabled={!image}
						>
							{loading && (
								<DynamicIcon className='animate-spin size-8' name='loader' />
							)}
							<span>Зареєструватися</span>
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className='justify-between text-muted-foreground'>
				<Link href='/auth/sign-in' children='Вже маєте аккаунт?' />
				<Link href='/auth/recovery' children='Забули ваш пароль?' />
			</CardFooter>
		</Card>
	)
}

export default SignUpForm
