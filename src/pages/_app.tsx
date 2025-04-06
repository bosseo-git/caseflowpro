import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from '@/components/ui/Toaster'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const router = useRouter()
  const isDashboardRoute = router.pathname.startsWith('/dashboard')

  return (
    <SessionProvider session={session}>
      <Head>
        <title>CaseFlowPro | Law Firm Intake Widget</title>
        <meta name="description" content="Client intake widget for lawyers and law firms that integrates with popular CRMs" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/images/favicon.png" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
      {!isDashboardRoute && <Toaster />}
    </SessionProvider>
  )
} 