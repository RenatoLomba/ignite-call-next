import type { AppProps } from 'next/app'

import { QueryClientProvider } from '@tanstack/react-query'

import { queryClient } from '../lib/query-client'
import { globalStyles } from '../styles/global'

globalStyles()

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  )
}
