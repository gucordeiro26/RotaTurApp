"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Filter, Star, Clock, Users, Heart, Calendar, Compass, Bookmark, Award } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Tipos de dados para o TypeScript
type Rota = {
  id: number
  nome: string
  descricao_curta: string | null
  categoria: string | null
  duracao: string | null
  dificuldade: string | null
  preco: number | null
  perfis: { nome_completo: string | null } | null
}

type Plano = {
  id: number
  status: string
  participantes: number
  data_reserva: string
  // CORREÇÃO AQUI: Esperamos uma lista de rotas
  rotas: { nome: string }[] | null 
}

export default function UserDashboard() {
  const { profile, user, isLoading: isUserLoading } = useUser()
  const [searchTerm, setSearchTerm] = useState("")
  const [rotas, setRotas] = useState<Rota[]>([])
  const [planos, setPlanos] = useState<Plano[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true)

      // Busca as rotas em destaque
      const { data: rotasData, error: rotasError } = await supabase
        .from('rotas')
        .select(`*, perfis ( nome_completo )`)
        .limit(3)
        .order('id', { ascending: false })

      if (rotasError) console.error("Erro ao buscar rotas:", rotasError)
      else setRotas(rotasData as Rota[] || [])

      // Se o usuário estiver logado, busca seus planos recentes
      if (user) {
        const { data: planosData, error: planosError } = await supabase
          .from('reservas')
          .select(`id, status, participantes, data_reserva, rotas ( nome )`)
          .eq('usuario_id', user.id)
          .limit(2)
          .order('criado_em', { ascending: false })

        if (planosError) console.error("Erro ao buscar planos:", planosError)
        // A conversão de tipo aqui é a parte importante da correção
        else setPlanos(planosData as any[] || []) 
      }

      setIsLoadingData(false)
    }

    fetchData()
  }, [user])

  const categories = [
    { name: "História", icon: Award, color: "bg-purple-500" },
    { name: "Natureza", icon: MapPin, color: "bg-green-500" },
    { name: "Gastronomia", icon: Star, color: "bg-orange-500" },
    { name: "Aventura", icon: Compass, color: "bg-blue-500" },
  ]

  if (isUserLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Olá, {profile?.nome_completo || 'Viajante'}!</h1>
                <p className="text-sm text-gray-600">Descubra novas aventuras</p>
              </div>
            </div>
            <Link href="/user/profile">
              <Avatar>
                <AvatarImage src={profile?.url_avatar || "/placeholder.svg?height=32&width=32"} />
                <AvatarFallback>{profile?.nome_completo?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Link>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar rotas turísticas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-12"
            />
            <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Categories */}
        <div>
          {/* ... (código das categorias e mapa não mudou) ... */}
           <h2 className="text-lg font-semibold mb-3">Categorias</h2>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {categories.map((category, index) => (
              <Link key={index} href={`/user/categories/${category.name.toLowerCase()}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <Link href="/user/map">
            <Card className="cursor-pointer hover:shadow-md transition-shadow bg-gradient-to-r from-blue-500 to-green-500">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 text-white">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm">Buscar no Mapa</h3>
                    <p className="text-xs opacity-90">Explore rotas visualmente</p>
                  </div>
                  <Compass className="w-5 h-5" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Featured Routes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Rotas em Destaque</h2>
            <Link href="/user/routes">
              <Button variant="ghost" size="sm">Ver Todas</Button>
            </Link>
          </div>
          <div className="space-y-4">
            {isLoadingData ? (
              <>
                <Skeleton className="h-40 w-full" />
                <Skeleton className="h-40 w-full" />
              </>
            ) : rotas.length > 0 ? (
              rotas.map((rota) => (
                <Card key={rota.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{rota.nome}</h3>
                    <p className="text-xs text-gray-600">por {rota.perfis?.nome_completo || 'Publicador'}</p>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">R$ {rota.preco}</p>
                      <p className="text-xs text-gray-500">por pessoa</p>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Link href={`/route-details/${rota.id}`} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">Ver Detalhes</Button>
                      </Link>
                      <Link href={`/user/booking/${rota.id}`} className="flex-1">
                        <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">Planejar Rota</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p className="text-center text-gray-500">Nenhuma rota encontrada no momento.</p>
            )}
          </div>
        </div>

        {/* Meus Planos Recentes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Meus Planos Recentes</h2>
            <Link href="/user/plans">
              <Button variant="ghost" size="sm">Ver Todos</Button>
            </Link>
          </div>
          <div className="space-y-3">
            {isLoadingData ? (
                <>
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </>
            ) : planos.length > 0 ? (
              planos.map((plano) => (
                <Card key={plano.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* CORREÇÃO AQUI: Acessamos o primeiro item da lista */}
                        <h4 className="font-medium text-sm">{plano.rotas?.[0]?.nome}</h4>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(plano.data_reserva).toLocaleDateString("pt-BR")}</span>
                          <span>•</span>
                          <span>{plano.participantes} pessoa(s)</span>
                        </div>
                      </div>
                      <Badge variant={plano.status === "confirmado" ? "default" : "secondary"}>{plano.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
                <p className="text-center text-gray-500">Você ainda não planejou nenhuma rota.</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
         <div className="grid grid-cols-4 py-2">
          <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-green-600"><Compass className="w-5 h-5" /><span className="text-xs mt-1">Explorar</span></Link>
          <Link href="/user/routes" className="flex flex-col items-center py-2 text-gray-600"><MapPin className="w-5 h-5" /><span className="text-xs mt-1">Rotas</span></Link>
          <Link href="/user/plans" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Meus Planos</span></Link>
          <Link href="/user/profile" className="flex flex-col items-center py-2 text-gray-600"><Bookmark className="w-5 h-5" /><span className="text-xs mt-1">Perfil</span></Link>
        </div>
      </div>
    </div>
  )
}