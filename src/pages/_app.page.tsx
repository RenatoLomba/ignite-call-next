import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import type { AppProps } from 'next/app'
import { Toaster } from 'react-hot-toast'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '../lib/query-client'
import { toastOptions } from '../lib/toast'
import { globalStyles } from '../styles/global'
import '../lib/dayjs'

globalStyles()

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://ignite-call.renato.com.br',
            siteName: 'Ignite Call',
          }}
        />

        <Component {...pageProps} />
        <Toaster toastOptions={toastOptions} />
      </QueryClientProvider>
    </SessionProvider>
  )
}
