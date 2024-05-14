import { ILoginData, ISignUpData } from './auth.interface'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '@/services'
import { toastError } from '@/utils'
import { IUser } from '@/interfaces'
import { toast } from 'sonner'

const signUp = createAsyncThunk<IUser, ISignUpData>(
	'auth/sign-up',
	async (signUpData: ISignUpData, thunkAPI) => {
		try {
			const {
				data: { data }
			} = await AuthService.signup(signUpData)
			toast.success('Успішна реєстрація, активуйте ваш аккаунт!')
			toast.success('Письмо активації було відправлено на Вашу пошту!')
			return data
		} catch (e) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const login = createAsyncThunk<IUser, ILoginData>(
	'auth/login',
	async (loginData: ILoginData, thunkAPI) => {
		try {
			const { data } = await AuthService.login(loginData)
			toast.success('Успішний вхід!')
			return data.data
		} catch (e: any) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const logOut = createAsyncThunk<any>('auth/logout', async (arg, thunkAPI) => {
	try {
		return await AuthService.logout()
	} catch (e) {
		toastError(e)
		return thunkAPI.rejectWithValue(e)
	}
})

export { signUp, login, logOut }
