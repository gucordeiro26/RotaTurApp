"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Search, Filter, Star, Clock, Users, Heart, Calendar, Compass, Bookmark, Award } from "lucide-react"
import Link from "next/link"
import { useUser } from "@/app/contexts/UserContext" // Importe o hook
import { Skeleton } from "@/components/ui/skeleton" // Importe o Skeleton para o loading
import { supabase } from "@/lib/supabase" // Importe o Supabase

// Definimos um tipo para nossas rotas, para o TypeScript nos ajudar
type Rota = {
  id: number
  nome: string
  descricao_curta: string
  categoria: string
  duracao: string
  dificuldade: string
  max_participantes: number
  preco: number
  // Adicionaremos mais campos aqui no futuro
}

export default function UserDashboard() {
  const [searchTerm, setSearchTerm] = useState("")

  const { profile, isLoading: isUserLoading } = useUser() // Use o hook para pegar o perfil

  const [rotas, setRotas] = useState<Rota[]>([]) // Estado para guardar as rotas do DB
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(true)

  // useEffect para buscar as rotas quando a página carregar
  useEffect(() => {
    const fetchRotas = async () => {
      setIsLoadingRoutes(true)
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .limit(3) // Buscamos apenas 3 para o "Destaque"

      if (error) {
        console.error("Erro ao buscar rotas:", error)
      } else {
        setRotas(data)
      }
      setIsLoadingRoutes(false)
    }

    fetchRotas()
  }, []) // O array vazio [] faz com que isso rode apenas uma vez

  const categories = [
    { name: "História", icon: Award, color: "bg-purple-500" },
    { name: "Natureza", icon: MapPin, color: "bg-green-500" },
    { name: "Gastronomia", icon: Star, color: "bg-orange-500" },
    { name: "Aventura", icon: Compass, color: "bg-blue-500" },
  ]

  const myBookings = [
    {
      id: 1,
      route: "Caminhada pelo Centro Histórico",
      date: "2024-01-25",
      time: "14:00",
      status: "Confirmado",
      participants: 2,
    },
    {
      id: 2,
      route: "Tour Gastronômico Local",
      date: "2024-01-28",
      time: "18:00",
      status: "Pendente",
      participants: 1,
    },
  ]

  // Se estiver carregando, mostre um esqueleto de UI
  if (isUserLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-40 w-full mt-4" />
        <Skeleton className="h-40 w-full mt-4" />
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

          {/* Search Bar */}
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

      <div className="p-4 space-y-6">
        {/* Categories */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Categorias</h2>
          <div className="grid grid-cols-4 gap-3 mb-3">
            {categories.map((category, index) => (
              <Link key={index} href={`/user/categories/${category.name.toLowerCase()}`}>
                <Card className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4 text-center">
                    <div
                      className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}
                    >
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-xs font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Rotas em Destaque - AGORA COM DADOS REAIS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold">Rotas em Destaque</h2>
              <Link href="/user/routes">
                <Button variant="ghost" size="sm">
                  Ver Todas
                </Button>
              </Link>
            </div>
            <div className="space-y-4">
              {isLoadingRoutes ? (
                <p>Carregando rotas...</p>
              ) : (
                rotas.map((rota) => (
                  <Card key={rota.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-sm mb-1">{rota.nome}</h3>
                      {/* Aqui exibimos os dados vindos do banco */}
                      <p className="text-xs text-gray-600 mb-2">{rota.descricao_curta}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-green-600">R$ {rota.preco}</p>
                        <Badge variant="outline">{rota.dificuldade}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Map Search Button */}
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
              <Button variant="ghost" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {isLoadingRoutes ? (
              <p>Carregando rotas...</p>
            ) : (
              rotas.map((rota) => (
                <Card key={rota.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm mb-1">{rota.nome}</h3>
                    <p className="text-xs text-gray-600 mb-2">{rota.descricao_curta}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-bold text-green-600">R$ {rota.preco}</p>
                      <Badge variant="outline">{rota.dificuldade}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* My Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Minhas Reservas</h2>
            <Link href="/user/bookings">
              <Button variant="ghost" size="sm">
                Ver Todas
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {myBookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{booking.route}</h4>
                      <div className="flex items-center space-x-2 mt-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {booking.date} às {booking.time}
                        </span>
                        <span>•</span>
                        <span>{booking.participants} pessoa(s)</span>
                      </div>
                    </div>
                    <Badge variant={booking.status === "Confirmado" ? "default" : "secondary"}>{booking.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/user/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <Compass className="w-5 h-5" />
            <span className="text-xs mt-1">Explorar</span>
          </Link>
          <Link href="/user/routes" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Rotas</span>
          </Link>
          <Link href="/user/map" className="flex flex-col items-center py-2 text-gray-600">
            <MapPin className="w-5 h-5" />
            <span className="text-xs mt-1">Mapa</span>
          </Link>
          <Link href="/user/profile" className="flex flex-col items-center py-2 text-gray-600">
            <Bookmark className="w-5 h-5" />
            <span className="text-xs mt-1">Perfil</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
