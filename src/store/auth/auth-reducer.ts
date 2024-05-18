import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { login, logOut, signUp, refreshAccessToken } from './auth.actions'
import { IAuthState } from './auth.interface'
import { ILoginResponse, IRefreshAccessTokenResponse } from '@/interfaces'

const initialState: IAuthState = {
	loading: false,
	user: undefined
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
	extraReducers: builder =>
		builder
			.addCase(login.pending, state => {
				state.loading = true
			})
			.addCase(login.rejected, state => {
				state.loading = false
				state.user = undefined
				state.accessToken = undefined
			})
			.addCase(login.fulfilled, (state, { payload }: PayloadAction<ILoginResponse>) => {
				state.user = payload.user
				state.loading = false
				state.accessToken = payload.accessToken
			})
			.addCase(signUp.pending, state => {
				state.loading = true
			})
			.addCase(signUp.rejected, state => {
				state.loading = false
				state.user = undefined
				state.accessToken = undefined
			})
			.addCase(signUp.fulfilled, (state, { payload }: PayloadAction<ILoginResponse>) => {
				state.user = payload.user
				state.loading = false
				state.accessToken = payload.accessToken
			})
			.addCase(refreshAccessToken.pending, state => {
				state.loading = false
			})
			.addCase(refreshAccessToken.rejected, state => {
				state.loading = false
				state.user = undefined
				state.accessToken = undefined
			})
			.addCase(refreshAccessToken.fulfilled, (state, { payload }: PayloadAction<IRefreshAccessTokenResponse>) => {
				state.loading = false
				state.accessToken = payload.accessToken
			})
			.addCase(logOut.pending, state => {
				state.loading = false
			})
			.addCase(logOut.rejected, state => {
				state.loading = false
				state.user = undefined
			})
			.addCase(logOut.fulfilled, state => {
				state.user = undefined
				state.loading = false
			}),
	reducers: {}
})
export default authSlice
