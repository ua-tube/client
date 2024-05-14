import { isRejectedWithValue } from '@reduxjs/toolkit'
import { toastError } from '@/utils'
import { Middleware } from 'redux'

export const rtkQueryErrorLogger: Middleware = () => next => action => {
	if (isRejectedWithValue(action)) toastError(action.message)
	return next(action)
}
