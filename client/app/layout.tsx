import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '../components/navbar';

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Scryer- Web intelligence',
  description: 'Scryer is an all-in-one solution for transforming web data into actionable knowledge.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Navbar />
        {children}
        </body>
    </html>
  )
}