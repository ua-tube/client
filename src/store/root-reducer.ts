import authSlice from './auth/auth-reducer'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
	auth: authSlice.reducer
})
