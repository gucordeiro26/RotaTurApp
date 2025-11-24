"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, MapPin, Clock, Filter, ArrowRight, Heart, ImageOff } from "lucide-react"
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
  imagem_url: string | null // Adicionado
}

export default function UserRoutesPage() {
  const { user } = useUser()
  const [rotas, setRotas] = useState<Rota[]>([])
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      
      const { data: rotasData } = await supabase
        .from('rotas')
        .select('*')
        .eq('status', 'Ativo')
        .order('criado_em', { ascending: false })

      if (rotasData) setRotas(rotasData as Rota[])

      if (user) {
        const { data: favData } = await supabase
          .from('favoritos')
          .select('rota_id')
          .eq('usuario_id', user.id)
        
        if (favData) setFavoritos(favData.map(f => f.rota_id))
      }

      setIsLoading(false)
    }

    fetchData()
  }, [user])

  const toggleFavorite = async (e: React.MouseEvent, rotaId: number) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
        alert("Faça login para salvar favoritos.")
        return
    }

    const isFavorited = favoritos.includes(rotaId)
    
    if (isFavorited) {
        setFavoritos(prev => prev.filter(id => id !== rotaId))
        await supabase.from('favoritos').delete().match({ usuario_id: user.id, rota_id: rotaId })
    } else {
        setFavoritos(prev => [...prev, rotaId])
        await supabase.from('favoritos').insert({ usuario_id: user.id, rota_id: rotaId })
    }
  }

  const filteredRoutes = useMemo(() => {
    return rotas.filter(rota => {
      const matchesSearch = rota.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            (rota.descricao_curta?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || rota.categoria === categoryFilter;
      const matchesDifficulty = difficultyFilter === 'all' || rota.dificuldade === difficultyFilter;

      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [rotas, searchTerm, categoryFilter, difficultyFilter]);

  const getDifficultyColor = (diff: string | null) => {
    switch (diff) {
      case "Fácil": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Moderado": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Difícil": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Explorar Rotas</h1>
        <p className="text-gray-600">Descubra as melhores experiências turísticas da região de Tatuí.</p>
      </div>

      <div className="max-w-6xl mx-auto bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 sticky top-4 z-10">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Pesquisar por nome ou descrição..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="historia">História</SelectItem>
                <SelectItem value="natureza">Natureza</SelectItem>
                <SelectItem value="gastronomia">Gastronomia</SelectItem>
                <SelectItem value="aventura">Aventura</SelectItem>
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Dificuldade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Moderado">Moderado</SelectItem>
                <SelectItem value="Difícil">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="h-[300px]"><CardHeader><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader><CardContent><Skeleton className="h-24 w-full" /></CardContent></Card>
            ))}
          </div>
        ) : filteredRoutes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRoutes.map((rota) => (
              <Link href={`/route-details/${rota.id}`} key={rota.id} className="group">
                <Card className="h-full flex flex-col transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-gray-200 relative overflow-hidden">
                  {/* --- LÓGICA DE IMAGEM --- */}
                  <div className="h-48 bg-gray-100 relative">
                    {rota.imagem_url ? (
                        <img 
                            src={rota.imagem_url} 
                            alt={rota.nome} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-200">
                            <ImageOff className="w-12 h-12" />
                        </div>
                    )}
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                    <div className="absolute top-3 right-3">
                      <Badge className="bg-white/90 text-gray-800 hover:bg-white shadow-sm backdrop-blur-sm">
                        {rota.categoria || 'Geral'}
                      </Badge>
                    </div>
                    
                    <button
                        onClick={(e) => toggleFavorite(e, rota.id)}
                        className="absolute top-3 left-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-sm backdrop-blur-sm transition-all z-10 group-hover:opacity-100"
                    >
                        <Heart 
                            className={`w-5 h-5 transition-colors ${favoritos.includes(rota.id) ? "fill-red-500 text-red-500" : "text-gray-400 hover:text-red-500"}`} 
                        />
                    </button>
                  </div>
                  
                  <CardHeader className="pb-2 pt-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {rota.nome}
                      </CardTitle>
                    </div>
                    <CardDescription className="line-clamp-2 h-10 text-sm">
                      {rota.descricao_curta || "Sem descrição disponível."}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-grow pb-2">
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

                  <CardFooter className="pt-2 pb-4 px-6 flex justify-end items-center border-t border-gray-100 mt-auto">
                    <span className="text-sm font-medium text-blue-600 group-hover:translate-x-1 transition-transform flex items-center">
                        Ver Detalhes <ArrowRight className="w-4 h-4 ml-1" />
                    </span>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <MapPin className="w-full h-full" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">Nenhuma rota encontrada</h3>
            <p className="text-gray-500 mt-1">Tente ajustar os filtros ou pesquise por outro termo.</p>
            <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setSearchTerm(""); setCategoryFilter("all"); setDifficultyFilter("all"); }}
            >
                Limpar Filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}