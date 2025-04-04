import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link 
          rel="icon" 
          href="/images/favicon.png" 
          type="image/png"
        />
        <link
          rel="apple-touch-icon"
          href="/images/favicon.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 