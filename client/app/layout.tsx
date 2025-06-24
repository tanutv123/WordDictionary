import type { Metadata } from 'next'
import './globals.css'
import { StoreWrapper } from '@/store/storeWrapper'
import { ToastContainer } from 'react-toastify'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <StoreWrapper>
          <ToastContainer position='bottom-right' hideProgressBar theme='colored' />
          {children}
        </StoreWrapper>
      </body>
    </html>
  )
}
