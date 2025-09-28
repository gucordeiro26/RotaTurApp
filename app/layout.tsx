import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { UserProvider } from './contexts/UserContext' // Importe aqui

export const metadata: Metadata = {
  title: 'RotaTur App', // Vamos aproveitar e trocar o título aqui também
  description: 'Plataforma de Gestão de Rotas Turísticas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <UserProvider> {/* Envolva o children aqui */}
          {children}
        </UserProvider>
      </body>
    </html>
  )
}