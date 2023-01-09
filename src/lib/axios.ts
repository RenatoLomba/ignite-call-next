import axios, { AxiosError } from 'axios'
import Router from 'next/router'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string } | null>) => {
    if (err.response?.status === 401) {
      const { message } = err.response.data!

      if (message === 'user.not.created') {
        Router.push('/register')
        return err.response
      } else if (message === 'user.not.authenticated') {
        Router.push('/register/calendar-connection')
        return err.response
      }
    }

    toast.error(err.response!.data?.message ?? 'Erro Interno')
    err.response!.data = null
    return err.response
  },
)
