import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'chatDAWAH - Islamic Q&A Chatbot',
  description: 'Islamic question and answer chatbot powered by knowledge from Muhammad Ali\'s "The Muslim Lantern" YouTube channel. Get answers to Islamic questions based on debates and discussions.',
  keywords: ['Islam', 'Islamic Q&A', 'Muslim Lantern', 'Muhammad Ali', 'Islamic Chatbot', 'Islamic Knowledge'],
  authors: [{ name: 'Mohammad Uwaish', url: 'https://github.com/mohammaduwaish' }],
  creator: 'Mohammad Uwaish',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
