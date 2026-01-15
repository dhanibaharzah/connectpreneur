import type React from "react"
import type { Metadata } from "next"
import { Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ConnectPreneur Boemkraf",
  description:
    "Platform katalog bisnis yang menghubungkan Anda dengan berbagai peluang usaha dan program kemitraan terbaik di Indonesia",
  generator: "v0.app",
  icons: {
    icon: "/images/logoconnectpreneur.png",
    apple: "/images/logoconnectpreneur.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
