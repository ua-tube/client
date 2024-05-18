import { ILoginResponse, IRefreshAccessTokenResponse, ILoginRequest, ISignUpRequest } from '@/interfaces'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '@/services'
import { toastError } from '@/utils'
import { toast } from 'sonner'

const login = createAsyncThunk<ILoginResponse, ILoginRequest>(
	'auth/sign-in',
	async (loginData, thunkAPI) => {
		try {
			const { data } = await AuthService.login(loginData)
			toast.success('Успішний вхід!')
			return data
		} catch (e: any) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const signUp = createAsyncThunk<ILoginResponse, ISignUpRequest>(
	'auth/sign-up',
	async (signUpData, thunkAPI) => {
		try {
			const { data } = await AuthService.signup(signUpData)
			toast.success('Успішна реєстрація, активуйте ваш аккаунт!')
			return data
		} catch (e) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const refreshAccessToken = createAsyncThunk<IRefreshAccessTokenResponse>(
	'auth/refresh-access-token',
	async (_, thunkAPI) => {
		try {
			const { data } = await AuthService.refreshAccessToken()
			return data
		} catch (e) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const logOut = createAsyncThunk('auth/logout', async (arg, thunkAPI) => {
	try {
		return AuthService.logout()
	} catch (e) {
		toastError(e)
		return thunkAPI.rejectWithValue(e)
	}
})

export { signUp, login, logOut, refreshAccessToken }
