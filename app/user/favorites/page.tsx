"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MapPin, Clock, Users, Star } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// O tipo de dado que esperamos receber do Supabase
type RotaFavorita = {
  id: number
  nome: string
  preco: number
  duracao: string
  dificuldade: string
}

export default function FavoritesPage() {
  const router = useRouter()
  const { user } = useUser()
  const [favoritos, setFavoritos] = useState<RotaFavorita[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      setIsLoading(true)

      // Query para buscar as rotas favoritadas pelo usuário
      // Ele olha na tabela 'favoritos' e pega os dados correspondentes da tabela 'rotas'
      const { data, error } = await supabase
        .from('favoritos')
        .select(`
          rotas (
            id,
            nome,
            preco,
            duracao,
            dificuldade
          )
        `)
        .eq('usuario_id', user.id)

      if (error) {
        console.error("Erro ao buscar favoritos:", error)
      } else if (data) {
        // O resultado vem aninhado, então precisamos extrair os dados da rota
        const rotasFavoritadas = data.map(item => item.rotas).filter(Boolean) as any[]
        setFavoritos(rotasFavoritadas)
      }
      setIsLoading(false)
    }

    fetchFavorites()
  }, [user])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-xl font-semibold">Minhas Rotas Favoritas</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {isLoading ? (
          // Skeleton loader enquanto os dados são carregados
          <>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </>
        ) : favoritos.length > 0 ? (
          // Lista de rotas favoritadas
          favoritos.map(rota => (
            <Link href={`/route-details/${rota.id}`} key={rota.id}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2">{rota.nome}</h3>
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{rota.duracao}</span></div>
                      <Badge variant="outline">{rota.dificuldade}</Badge>
                    </div>
                    <p className="font-semibold text-green-600">R$ {rota.preco}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        ) : (
          // Mensagem para quando não há favoritos
          <div className="text-center py-16">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma rota favorita</h3>
            <p className="mt-1 text-sm text-gray-500">Explore as rotas e clique no coração para salvá-las aqui.</p>
            <div className="mt-6">
              <Link href="/user/dashboard">
                <Button>Explorar Rotas</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}