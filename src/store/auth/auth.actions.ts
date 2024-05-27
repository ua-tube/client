import { ILoginResponse, ILoginRequest } from '@/interfaces'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService, CreatorService } from '@/services'
import { toastError } from '@/utils'
import { toast } from 'sonner'

const login = createAsyncThunk<ILoginResponse, ILoginRequest>(
	'auth/sign-in',
	async (loginData, thunkAPI) => {
		try {
			const {
				data: { accessToken, user }
			} = await AuthService.login(loginData)
			const { data: creator } = await CreatorService.getCreatorByUserId(user.id, accessToken)

			toast.success('Успішний вхід!')

			return { accessToken, user: { ...user, creator } }
		} catch (e: any) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

const refreshAccessToken = createAsyncThunk<string, string>(
	'auth/refresh-access-token',
	async (s, thunkAPI) => {
		return s
	}
)

const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
	try {
		console.log('srabatue func')
		await AuthService.logout()
	} catch (e) {
		toastError(e)
		return thunkAPI.rejectWithValue(e)
	}
})

export { login, logOut, refreshAccessToken }
