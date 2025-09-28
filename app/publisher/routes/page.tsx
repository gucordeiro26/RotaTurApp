"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Search,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreVertical,
  Users,
  Calendar,
  DollarSign,
  Star,
  Clock,
  MapPin,
  TrendingUp,
  Pause,
  Play,
  BarChart3,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

// Definimos um tipo para as rotas
type Rota = {
  id: number
  nome: string
  preco: number
  duracao: string
  dificuldade: string
  criado_em: string
  // Adicionaremos mais campos conforme necessário
}

export default function PublisherRoutes() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("active")
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMinhasRotas = async () => {
      if (!user) return // Se não houver usuário, não faz nada

      setIsLoading(true)
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .eq('publicador_id', user.id) // A MÁGICA ACONTECE AQUI!

      if (error) {
        console.error("Erro ao buscar rotas do publicador:", error)
      } else {
        setRotas(data)
      }
      setIsLoading(false)
    }

    fetchMinhasRotas()
  }, [user]) // Rode essa busca sempre que o objeto 'user' mudar

  const getStatusColor = (status: string) => { // Adicionei status para o futuro
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Fácil": return "bg-green-100 text-green-800"
      case "Moderado": return "bg-yellow-100 text-yellow-800"
      case "Difícil": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const RouteCard = ({ rota }: { rota: Rota }) => (
    <Card className="overflow-hidden">
      <CardContent className="flex-1 p-3">
        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{rota.nome}</h3>
        <p className="text-xs text-gray-500 mb-2">
            Criado em {new Date(rota.criado_em).toLocaleDateString("pt-BR")}
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
            <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{rota.duracao}</span>
            </div>
            <div className="flex items-center space-x-1">
                <DollarSign className="w-3 h-3" />
                <span>R$ {rota.preco}</span>
            </div>
            <Badge className={`text-xs ${getDifficultyColor(rota.dificuldade)}`}>{rota.dificuldade}</Badge>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/publisher/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="text-xl font-semibold">Minhas Rotas</h1>
            </div>
            <Link href="/publisher/routes/create">
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Rota
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Publicadas ({rotas.length})</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos (0)</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {isLoading ? (
              <p>Carregando suas rotas...</p>
            ) : rotas.length > 0 ? (
              <div className="space-y-4">
                {rotas.map((rota) => (
                  <RouteCard key={rota.id} rota={rota} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="font-medium text-gray-900 mb-2">Nenhuma rota encontrada</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Você ainda não criou nenhuma rota. Que tal começar agora?
                  </p>
                  <Link href="/publisher/routes/create">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Criar Primeira Rota
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation ... */}
    </div>
  )
}