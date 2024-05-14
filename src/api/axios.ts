import axios from 'axios'

export const baseURL = `${process.env.SERVER_URL}/api`

export const $axios = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
})

export const $axiosFormData = axios.create({
	baseURL,
	withCredentials: true,
	headers: {
		'Content-Type': 'multipart/form-data'
	}
})
