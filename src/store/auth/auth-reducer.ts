import { login, logOut, refreshAccessToken } from './auth.actions'
import { ILoginResponse, ICreator, IUser } from '@/interfaces'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IAuthState } from './auth.interface'

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
			.addCase(
				login.fulfilled,
				(state, { payload }: PayloadAction<ILoginResponse>) => {
					state.user = payload.user
					state.loading = false
					state.accessToken = payload.accessToken
				}
			)
			.addCase(refreshAccessToken.pending, state => {
				state.loading = false
			})
			.addCase(refreshAccessToken.rejected, state => {
				state.loading = false
				state.user = undefined
				state.accessToken = undefined
			})
			.addCase(
				refreshAccessToken.fulfilled,
				(state, { payload }: PayloadAction<string>) => {
					state.loading = false
					state.accessToken = payload
				}
			)
			.addCase(logOut.pending, state => {
				state.loading = false
				state.user = undefined
			})
			.addCase(logOut.rejected, state => {
				state.loading = false
				state.user = undefined
			})
			.addCase(logOut.fulfilled, state => {
				state.user = undefined
				state.loading = false
			}),
	reducers: {
		signUp: (state, { payload }: PayloadAction<ILoginResponse>) => {
			state.user = payload.user
			state.loading = false
			state.accessToken = payload.accessToken
		},
		updateCreator: (state, { payload }: PayloadAction<ICreator>) => {
			state.user = { ...state.user, creator: payload } as IUser
		}
	}
})
export default authSlice
