import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { login, logOut, refreshAccessToken, signUp } from './auth.actions'
import { IAuthState } from './auth.interface'
import { IUser } from '@/interfaces'

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
			})
			.addCase(login.fulfilled, (state, { payload }: PayloadAction<IUser>) => {
				state.user = payload
				state.loading = false
			})
			.addCase(signUp.pending, state => {
				state.loading = true
			})
			.addCase(signUp.rejected, state => {
				state.loading = false
				state.user = undefined
			})
			.addCase(signUp.fulfilled, (state, { payload }: PayloadAction<IUser>) => {
				state.user = payload
				state.loading = false
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
