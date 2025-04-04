import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/Toaster'
import Head from 'next/head'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Head>
        <title>CaseFlowPro - Intake Widget for Law Firms</title>
        <meta name="description" content="Client intake widget for lawyers and law firms with GoHighLevel integration" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  )
} 