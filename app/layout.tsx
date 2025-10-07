import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import ClientUserProvider from './contexts/ClientUserProvider' // Alterado

export const metadata: Metadata = {
  title: 'RotaTur App',
  description: 'Plataforma de Gestão de Rotas Turísticas',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        {/* As folhas de estilo do Leaflet devem ser importadas nos componentes que as utilizam */}
      </head>
      <body>
        <ClientUserProvider> {/* Alterado */}
          {children}
        </ClientUserProvider> {/* Alterado */}
      </body>
    </html>
  )
}