"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Clock, ArrowRight, Heart, ArrowLeft, ImageOff } from "lucide-react"
import Link from "next/link"

type Rota = {
  id: number
  nome: string
  descricao_curta: string | null
  categoria: string | null
  dificuldade: string | null
  duracao: string | null
  origem_coords: any
  status: string
  imagem_url: string | null; // Adicionado
}

export default function UserFavoritesPage() {
  const { user } = useUser()
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      setIsLoading(true)
      
      const { data, error } = await supabase
        .from('favoritos')
        .select('rota_id, rotas (*)')
        .eq('usuario_id', user.id)

      if (error) {
        console.error("Erro ao buscar favoritos:", error)
      } else if (data) {
        const rotasFavoritas = data
            .map((item: any) => item.rotas)
            .filter((r: any) => r !== null)
        
        setRotas(rotasFavoritas)
      }
      setIsLoading(false)
    }

    fetchFavorites()
  }, [user])

  const removeFavorite = async (e: React.MouseEvent, rotaId: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) return

    setRotas(prev => prev.filter(r => r.id !== rotaId))
    await supabase.from('favoritos').delete().match({ usuario_id: user.id, rota_id: rotaId })
  }

  const getDifficultyColor = (diff: string | null) => {
    switch (diff) {
      case "Fácil": return "bg-green-100 text-green-800";
      case "Moderado": return "bg-yellow-100 text-yellow-800";
      case "Difícil": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  if (isLoading) {
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Skeleton className="h-[300px]" /><Skeleton className="h-[300px]" /><Skeleton className="h-[300px]" />
                </div>
            </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex items-center gap-4 mb-2">
            <Link href="/user/routes">
                <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Meus Favoritos</h1>
        </div>
        <p className="text-gray-600 ml-14">As rotas que você guardou para a sua próxima aventura.</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {rotas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rotas.map((rota) => (
              <Link href={`/route-details/${rota.id}`} key={rota.id} className="group block h-full">
                <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg border-gray-200 relative overflow-hidden">
                  
                  {/* --- IMAGEM --- */}
                  <div className="h-40 bg-gray-100 relative">
                    {rota.imagem_url ? (
                        <img 
                            src={rota.imagem_url} 
                            alt={rota.nome} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-50 to-rose-50 text-rose-200">
                            <ImageOff className="w-12 h-12" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-800 hover:bg-white shadow-sm">
                        {rota.categoria || 'Geral'}
                      </Badge>
                    </div>
                    
                    <button
                        onClick={(e) => removeFavorite(e, rota.id)}
                        className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-red-50 text-red-500 shadow-sm transition-colors z-10"
                        title="Remover dos favoritos"
                    >
                        <Heart className="w-5 h-5 fill-red-500" />
                    </button>
                  </div>
                  
                  <CardHeader className="pb-3 pt-4">
                    <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600">
                      {rota.nome}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 h-10 text-sm">
                      {rota.descricao_curta || "Sem descrição."}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                        <Badge variant="secondary" className={getDifficultyColor(rota.dificuldade)}>
                            {rota.dificuldade}
                        </Badge>
                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md">
                            <Clock className="w-3 h-3 mr-1" />
                            {rota.duracao || 'N/A'}
                        </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-0 border-t bg-gray-50/50 p-4 flex justify-end">
                    <Button size="sm" variant="ghost" className="text-blue-600 p-0 hover:bg-transparent">
                        Ver Detalhes <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <Heart className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">Ainda não tem favoritos</h3>
            <p className="text-gray-500 mt-1 mb-6">Explore as rotas disponíveis e clique no coração para guardar as que mais gostar.</p>
            <Link href="/user/routes">
                <Button>Explorar Rotas</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}