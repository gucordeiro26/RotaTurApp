"use client"

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RotaComCoordenadas } from '@/components/OverviewMap'

export default function MapPage() {
  const [rotas, setRotas] = useState<RotaComCoordenadas[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRotasParaMapa = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('rotas')
            .select('id, nome, origem_coords')
            .not('origem_coords', 'is', null)

        if(error) {
            console.error("Erro ao buscar rotas para o mapa:", error)
        } else {
            setRotas(data as RotaComCoordenadas[])
        }
        setIsLoading(false)
    }

    fetchRotasParaMapa()
  }, [])

  
  const OverviewMap = useMemo(() => dynamic(() => import('@/components/OverviewMap'), { 
    loading: () => <Skeleton className="w-full h-full" />,
    ssr: false
  }), [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b z-10 flex-shrink-0">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/user/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Mapa de Rotas</h1>
        </div>
      </header>

      {/* Container do Mapa */}
      <main className="flex-grow h-full">
        {/* Adicionamos uma verificação extra para garantir que o mapa só renderiza quando não está a carregar */}
        {!isLoading && <OverviewMap rotas={rotas} />}
      </main>
    </div>
  )
}