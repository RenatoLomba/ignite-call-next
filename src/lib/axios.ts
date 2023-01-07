import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'

export const api = axios.create({
  baseURL: '/api',
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ success?: boolean; message?: string }>) => {
    toast.error(err.response?.data?.message ?? 'Erro Interno')
    return err.response
  },
)
