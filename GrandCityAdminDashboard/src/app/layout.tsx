import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Grand City Admin Dashboard',
  description: 'Admin Dashboard for Grand City Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
