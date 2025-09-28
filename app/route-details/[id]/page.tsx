"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Star,
  Calendar,
  Share,
  Heart,
  MessageSquare,
  Navigation,
} from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Tipos para os dados que vamos buscar
type PerfilPublicador = {
  nome_completo: string | null
  url_avatar: string | null
}

type RotaCompleta = {
  id: number
  nome: string
  descricao: string | null
  preco: number | null
  duracao: string | null
  dificuldade: string | null
  max_participantes: number | null
  perfis: PerfilPublicador | null
}

export default function RouteDetails() {
  const [rota, setRota] = useState<RotaCompleta | null>(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const params = useParams()
  const router = useRouter()
  const { user } = useUser()
  
  const routeId = params.id

  const checkFavoriteStatus = useCallback(async () => {
    if (!user || !routeId) return

    const { data, error } = await supabase
      .from('favoritos')
      .select('id')
      .eq('usuario_id', user.id)
      .eq('rota_id', routeId)
      .single()

    if (data && !error) {
      setIsFavorited(true)
    } else {
      setIsFavorited(false)
    }
  }, [user, routeId])

  useEffect(() => {
    const fetchRouteDetails = async () => {
      if (!routeId) return

      setIsLoading(true)

      const { data, error } = await supabase
        .from('rotas')
        .select('*, perfis ( nome_completo, url_avatar )')
        .eq('id', routeId)
        .single()

      if (error || !data) {
        console.error("Erro ao buscar detalhes da rota:", error)
        // Idealmente, redirecionar para uma página 404
        router.push('/user/dashboard') 
      } else {
        setRota(data as RotaCompleta)
        await checkFavoriteStatus()
      }
      setIsLoading(false)
    }

    if (user) { // Garante que a busca só começa quando o usuário está disponível
        fetchRouteDetails()
    } else {
        // Se o usuário ainda não carregou, esperamos. Se não houver usuário, a busca de favoritos não acontece.
        // Podemos buscar os detalhes da rota mesmo sem usuário.
        const fetchPublicRouteDetails = async () => {
            if (!routeId) return
            setIsLoading(true)
            const { data, error } = await supabase
                .from('rotas')
                .select('*, perfis ( nome_completo, url_avatar )')
                .eq('id', routeId)
                .single()
            if (error || !data) {
                router.push('/not-found') 
            } else {
                setRota(data as RotaCompleta)
            }
            setIsLoading(false)
        }
        fetchPublicRouteDetails()
    }
  }, [routeId, router, user, checkFavoriteStatus])

  const toggleFavorite = async () => {
    if (!user || !rota) {
      router.push('/') // Se não estiver logado, redireciona para o login
      return
    }

    if (isFavorited) {
      const { error } = await supabase
        .from('favoritos')
        .delete()
        .eq('usuario_id', user.id)
        .eq('rota_id', rota.id)
      
      if (!error) setIsFavorited(false)
    } else {
      const { error } = await supabase
        .from('favoritos')
        .insert({ usuario_id: user.id, rota_id: rota.id })

      if (!error) setIsFavorited(true)
    }
  }

  if (isLoading) {
    return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-8 w-3/4 mt-4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    )
  }

  if (!rota) {
    return <div className="p-4 text-center">Rota não encontrada.</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleFavorite}>
              <Heart className={`w-4 h-4 transition-colors ${isFavorited ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
            </Button>
          </div>
        </div>
      </div>

      <div className="pb-20">
        {/* Imagem da Rota */}
        <div className="relative">
          <img src={"/placeholder.svg?height=200&width=300"} alt={rota.nome} className="w-full h-48 object-cover" />
        </div>

        <div className="p-4 space-y-6">
          {/* Informações Básicas */}
          <div>
            <h1 className="text-2xl font-bold mb-2">{rota.nome}</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <Badge variant="outline">{rota.dificuldade}</Badge>
            </div>
            <p className="text-gray-700">{rota.descricao}</p>
          </div>

          {/* Informações do Publicador */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={rota.perfis?.url_avatar || "/placeholder.svg"} />
                  <AvatarFallback>{rota.perfis?.nome_completo?.charAt(0) || 'P'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-medium">{rota.perfis?.nome_completo || "Publicador Anônimo"}</h3>
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contato
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <DollarSign className="w-6 h-6 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold">R$ {rota.preco}</p>
                <p className="text-sm text-gray-600">por pessoa</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{rota.duracao}</p>
                <p className="text-sm text-gray-600">duração</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-6 h-6 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold">{rota.max_participantes}</p>
                <p className="text-sm text-gray-600">vagas</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="w-6 h-6 mx-auto text-orange-600 mb-2" />
                <p className="text-lg font-bold">Verificar datas</p>
                <p className="text-sm text-gray-600">próximo disponível</p>
              </CardContent>
            </Card>
          </div>

          {/* O resto do conteúdo, como mapa, o que está incluído, etc. */}
          
        </div>
      </div>

      {/* Barra de Ação Inferior */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1">
            Mensagem para Publicador
          </Button>
          <Link href={`/user/booking/${rota.id}`} className="flex-1">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Solicitar Reserva - R$ {rota.preco}</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}