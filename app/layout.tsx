import type React from "react"
import type { Metadata, Viewport } from "next"
import { Nunito, Open_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _nunito = Nunito({ subsets: ["latin"], variable: "--font-nunito" })
const _openSans = Open_Sans({ subsets: ["latin"], variable: "--font-open-sans" })

export const metadata: Metadata = {
  title: "TripStash - Save Your Travel Places",
  description: "A simple, beautiful PWA to save and retrieve places during your travels. Works offline!",
  generator: "v0.app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#F97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_nunito.variable} ${_openSans.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
