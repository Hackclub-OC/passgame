import type React from "react"
import { Noto_Serif } from "next/font/google"
import "./globals.css"

const notoSerif = Noto_Serif({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={notoSerif.className}>{children}</body>
    </html>
  )
}

export const metadata = {
  title: "The Password Game",
  description: "A challenging password creation game",
}

