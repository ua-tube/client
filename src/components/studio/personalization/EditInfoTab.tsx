import { zodResolver } from '@hookform/resolvers/zod'
import { getChannelUrl, toastError } from '@/utils'
import { useActions, useAuth } from '@/hooks'
import { useTranslation } from 'next-i18next'
import { CreatorService } from '@/services'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { FC } from 'react'
import { z } from 'zod'
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea
} from '@/components'

const EditInfoTab: FC = () => {
	const { t } = useTranslation('studio')

	const profileFormSchema = z.object({
		nickname: z
			.string()
			.min(2, { message: t('minLength', { length: 2 }) })
			.max(30, { message: t('maxLength', { length: 30 }) }),
		displayName: z
			.string()
			.min(4, { message: t('minLength', { length: 4 }) })
			.max(30, { message: t('maxLength', { length: 30 }) }),
		email: z.string().email(),
		description: z
			.string()
			.max(9999, { message: t('maxLength', { length: 9999 }) })
	})

	const { user } = useAuth()
	const { updateCreator } = useActions()

	const form = useForm<z.infer<typeof profileFormSchema>>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			description: user?.creator.description ?? '',
			displayName: user?.creator.displayName,
			email: user?.email,
			nickname: user?.creator.nickname
		},
		mode: 'onSubmit'
	})

	const onSubmit = async (data: z.infer<typeof profileFormSchema>) => {
		try {
			const { data: creator } = await CreatorService.updateCreator(data)
			updateCreator(creator)
			toast.success(t('updateSucc'))
		} catch (e) {
			toastError(e)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
				<FormField
					control={form.control}
					name='displayName'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('name.title')}</FormLabel>
							<FormDescription>{t('name.desc')}</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='nickname'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('username.title')}</FormLabel>
							<FormDescription>{t('username.desc')}</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormDescription
								children={getChannelUrl(
									form.getValues('nickname') as string,
									undefined,
									false
								)}
							/>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='email'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('email.title')}</FormLabel>
							<FormDescription>{t('email.desc')}</FormDescription>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='description'
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t('channelDesc.title')}</FormLabel>
							<FormDescription>{t('channelDesc.desc')}</FormDescription>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type='submit'>{t('update')}</Button>
			</form>
		</Form>
	)
}

export default EditInfoTab
