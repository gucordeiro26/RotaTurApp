"use client"

import dynamic from 'next/dynamic'

const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
  loading: () => <p>Carregando...</p>
})

export default function LoginPage() {
  return <LoginForm />
}