import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '../lib/query-client'
import { toastOptions } from '../lib/toast'
import { globalStyles } from '../styles/global'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster toastOptions={toastOptions} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
