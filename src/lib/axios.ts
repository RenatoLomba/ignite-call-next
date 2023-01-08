import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ message?: string } | null>) => {
    toast.error(err.response!.data?.message ?? 'Erro Interno')
    err.response!.data = null
    return err.response
  },
)
