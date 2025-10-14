"use client"

import { useState, useEffect, useMemo } from "react"
import dynamic from 'next/dynamic'
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MapPin, Clock, Users, DollarSign, Share, MessageSquare, Navigation, Pin } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { RotaParaMapa } from "@/components/Map"

type PontoDeInteresse = { id: number; nome: string; coords: { lat: number, lng: number }; }
type RotaCompleta = {
  id: number; nome: string; descricao: string | null; preco: number | null; duracao: string | null;
  dificuldade: string | null; categoria: string | null; max_participantes: number | null;
  origem_coords: { lat: number, lng: number, nome?: string } | null;
  destino_coords: { lat: number, lng: number, nome?: string } | null;
  perfis: { nome_completo: string | null, url_avatar: string | null } | null;
  pontos_interesse: PontoDeInteresse[];
}

export default function RouteDetails() {
  const [rota, setRota] = useState<RotaCompleta | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const routeId = params.id

  const Map = useMemo(() => dynamic(() => import('@/components/Map'), { 
    loading: () => <Skeleton className="w-full h-full rounded-lg" />, ssr: false 
  }), [])

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!routeId) return
      setIsLoading(true)
      const { data, error } = await supabase
        .from('rotas')
        .select(`*, perfis ( nome_completo, url_avatar ), pontos_interesse ( id, nome, coords )`)
        .eq('id', routeId)
        .single()
      if (error || !data) {
        console.error("Erro ao buscar detalhes da rota:", error)
        router.push('/not-found') 
      } else {
        setRota(data as RotaCompleta)
      }
      setIsLoading(false)
    }
    fetchRouteDetails()
  }, [routeId, router])

  if (isLoading) {
    return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-48 w-full" /> <Skeleton className="h-8 w-3/4 mt-4" />
            <Skeleton className="h-20 w-full" /> <Skeleton className="h-32 w-full" />
        </div>
    )
  }

  if (!rota) return <div className="p-4 text-center">Rota não encontrada.</div>
  
  const rotaParaMapa: RotaParaMapa = {
      origem_coords: rota.origem_coords,
      destino_coords: rota.destino_coords,
      pontos_interesse: rota.pontos_interesse.map(p => ({ 
          id: p.id, 
          lat: p.coords.lat, 
          lng: p.coords.lng, 
          nome: p.nome 
      }))
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}><ArrowLeft className="w-4 h-4" /></Button>
          <div className="flex space-x-2"><Button variant="ghost" size="sm"><Share className="w-4 h-4" /></Button></div>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          <div>
            {rota.categoria && <Badge variant="outline" className="mb-2">{rota.categoria}</Badge>}
            <h1 className="text-2xl font-bold mb-2">{rota.nome}</h1>
            <p className="text-gray-700 mb-4">{rota.descricao}</p>
          </div>

          <Card>
            <CardHeader><CardTitle className="text-lg flex items-center"><Navigation className="w-5 h-5 mr-2"/> Mapa da Rota</CardTitle></CardHeader>
            <CardContent>
              <div className="w-full h-[300px] rounded-lg overflow-hidden border">
                {rotaParaMapa.origem_coords ? <Map rota={rotaParaMapa} /> : <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">Mapa indisponível.</div>}
              </div>
              {rota.pontos_interesse.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h4 className="font-medium text-sm">Pontos da Rota:</h4>
                  <ul className="list-none space-y-2">
                    {rota.pontos_interesse.map((ponto) => (
                      <li key={ponto.id} className="flex items-start space-x-2 text-sm">
                        <Pin className="w-4 h-4 text-blue-500 flex-shrink-0 mt-1" />
                        <span>{ponto.nome}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar><AvatarImage src={rota.perfis?.url_avatar || "/placeholder.svg"} /><AvatarFallback>{rota.perfis?.nome_completo?.charAt(0) || 'P'}</AvatarFallback></Avatar>
                <div className="flex-1"><h3 className="font-medium">{rota.perfis?.nome_completo || "Publicador Anônimo"}</h3></div>
                <Button variant="outline" size="sm"><MessageSquare className="w-4 h-4 mr-2" /> Contato</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardContent className="p-4 text-center">
                    <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
                    <p className="text-2xl font-bold">R$ {rota.preco || 'Grátis'}</p>
                    <p className="text-sm text-gray-600">por pessoa</p>
                </CardContent>
            </Card>
            <Card>
                <CardContent className="p-4 text-center">
                    <Clock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                    <p className="text-2xl font-bold">{rota.duracao || 'N/A'}</p>
                    <p className="text-sm text-gray-600">duração</p>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t p-4 flex-shrink-0">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">Mensagem</Button>
          <Link href={`/user/plan/${rota.id}`} className="flex-1"><Button className="w-full bg-blue-600 hover:bg-blue-700">Planejar Rota</Button></Link>
        </div>
      </footer>
    </div>
  )
}