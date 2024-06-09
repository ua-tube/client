import { ILoginRequest, ILoginResponse } from '@/interfaces'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { AuthService } from '@/services'
import { toastError } from '@/utils'

const login = createAsyncThunk<ILoginResponse, ILoginRequest>(
	'auth/sign-in',
	async (loginData, thunkAPI) => {
		try {
			return loginData
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

const logOut = createAsyncThunk(
	'auth/logout',
	async (data: { accessToken?: string }, thunkAPI) => {
		try {
			return await AuthService.logout(data.accessToken)
		} catch (e) {
			toastError(e)
			return thunkAPI.rejectWithValue(e)
		}
	}
)

export { login, logOut, refreshAccessToken }
