"use client"

import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

// O tipo de dado que esperamos do banco
type RotaComCoordenadas = {
    id: number;
    nome: string;
    origem_coords: { lat: number; lng: number };
}

export default function MapPage() {
  const [rotas, setRotas] = useState<RotaComCoordenadas[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Busca as rotas com coordenadas do banco de dados
  useEffect(() => {
    const fetchRotasParaMapa = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('rotas')
            .select('id, nome, origem_coords')
            .not('origem_coords', 'is', null) // Traz apenas rotas que tenham coordenadas

        if(error) {
            console.error("Erro ao buscar rotas para o mapa:", error)
        } else {
            setRotas(data as RotaComCoordenadas[])
        }
        setIsLoading(false)
    }

    fetchRotasParaMapa()
  }, [])

  
  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { 
    loading: () => <Skeleton className="w-full h-full" />,
    ssr: false
  }), [])

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b z-10">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/user/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-xl font-semibold">Mapa de Rotas</h1>
        </div>
      </div>

      {/* Container do Mapa */}
      <div className="flex-grow h-full">
        {/* Passamos as rotas carregadas como uma propriedade para o componente Map */}
        {!isLoading && <Map rotas={rotas} />}
      </div>
    </div>
  )
}