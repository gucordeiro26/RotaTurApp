"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Search, Star, Clock, Users, Heart, MapPin, SlidersHorizontal } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Definimos o tipo para os dados da rota que virão do banco
type Rota = {
  id: number
  nome: string
  preco: number | null
  duracao: string | null
  dificuldade: string | null
  // No futuro, podemos adicionar o nome do publicador, etc.
}

export default function AllRoutes() {
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  // Estados para filtros (funcionalidade futura)
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchAllRotas = async () => {
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('rotas')
        .select('*') // Busca todas as rotas, sem limite

      if (error) {
        console.error("Erro ao buscar todas as rotas:", error)
      } else {
        setRotas(data || [])
      }
      setIsLoading(false)
    }

    fetchAllRotas()
  }, [])

  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800"
      case "Moderado": return "bg-yellow-100 text-yellow-800"
      case "Difícil": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Lógica de filtro simples (pode ser aprimorada no futuro)
  const filteredRoutes = rotas.filter(rota => 
    rota.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3 mb-4">
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Todas as Rotas</h1>
            <div className="flex-1" />
            <Link href="/user/map">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Mapa
              </Button>
            </Link>
          </div>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar rotas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {/* A funcionalidade dos filtros pode ser implementada no futuro */}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-4">
          <p className="text-sm text-gray-600">{filteredRoutes.length} rotas encontradas</p>
        </div>

        {/* Routes Grid */}
        <div className="space-y-4 pb-20">
          {isLoading ? (
            <>
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full"/>
                <Skeleton className="h-32 w-full"/>
            </>
          ) : (
            filteredRoutes.map((rota) => (
                <Card key={rota.id} className="overflow-hidden">
                    <CardContent className="flex-1 p-3">
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1 pr-2">
                                <h3 className="font-semibold text-sm mb-1 line-clamp-1">{rota.nome}</h3>
                                <p className="text-xs text-gray-600 mb-1">por Publicador</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-green-600">R$ {rota.preco}</p>
                                <p className="text-xs text-gray-500">por pessoa</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-xs text-gray-600">
                                <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{rota.duracao}</span></div>
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(rota.dificuldade)}`}>{rota.dificuldade}</Badge>
                        </div>

                        <div className="flex space-x-2 mt-2">
                            <Link href={`/route-details/${rota.id}`} className="flex-1">
                                <Button variant="outline" className="w-full h-7 text-xs">Detalhes</Button>
                            </Link>
                            <Link href={`/user/booking/${rota.id}`} className="flex-1">
                                <Button className="w-full h-7 text-xs bg-green-600 hover:bg-green-700">Planejar</Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}