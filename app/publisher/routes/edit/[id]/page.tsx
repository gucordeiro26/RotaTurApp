"use client"

import dynamic from 'next/dynamic'

const EditRouteForm = dynamic(() => import('@/components/EditRouteForm'), {
  ssr: false,
  loading: () => <div className="p-8 text-center">Carregando editor de rotas...</div>
})

export default function EditRoutePage() {
  return <EditRouteForm />
}