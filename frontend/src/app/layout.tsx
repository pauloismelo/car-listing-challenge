import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import './globals.css'

import Image from './components/images/logoImage'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'car-listing-challenge | Paulo Melo',
  description: 'test developed by Paulo Melo for Knowtrex company'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

          <div className="min-h-screen flex flex-col items-center">
            <header className="bg-green-950 text-white w-full p-2 ">
              <h1 className="text-xl font-bold mb-4">
                <Image widthImage={50} />
              </h1>
            </header>
            <main className="flex flex-col items-center flex-1 w-full">
            {children}
            </main>

            <ToastContainer position="top-right" autoClose={3000} />
            <footer className='bg-green-950 text-white w-full'>
              <p className="text-center text-white text-sm mt-4">
                &copy; test developed by Paulo Melo for Knowtrex company
              </p>
            </footer>
          </div>
        
        
      </body>
    </html>
  )
}
