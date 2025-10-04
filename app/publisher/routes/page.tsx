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
  status: string // Adicionado para futuras implementações
}

export default function PublisherRoutes() {
  const { user } = useUser()
  const [activeTab, setActiveTab] = useState("active")
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")


  useEffect(() => {
    const fetchMinhasRotas = async () => {
      if (!user) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .eq('publicador_id', user.id)

      if (error) {
        console.error("Erro ao buscar rotas do publicador:", error)
      } else {
        setRotas(data as Rota[] || [])
      }
      setIsLoading(false)
    }

    fetchMinhasRotas()
  }, [user])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800"
      case "Pausado": return "bg-yellow-100 text-yellow-800"
      case "Rascunho": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
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
            <div className="flex justify-between items-start mb-2">
                <div className="flex-1 pr-2">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">{rota.nome}</h3>
                    <div className="flex items-center space-x-2 mb-1">
                        <Badge className={`text-xs ${getStatusColor(rota.status || 'Rascunho')}`}>{rota.status || 'Rascunho'}</Badge>
                        <Badge className={`text-xs ${getDifficultyColor(rota.dificuldade)}`}>{rota.dificuldade}</Badge>
                    </div>
                    <p className="text-xs text-gray-500">Criado em {new Date(rota.criado_em).toLocaleDateString("pt-BR")}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* --- INÍCIO DA CORREÇÃO --- */}
                        <Link href={`/route-details/${rota.id}`}>
                            <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                Ver Detalhes
                            </DropdownMenuItem>
                        </Link>
                        {/* --- FIM DA CORREÇÃO --- */}
                        <DropdownMenuItem>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Copy className="w-4 h-4 mr-2" />
                            Duplicar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Excluir
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{rota.duracao || 'N/A'}</span></div>
                <div className="flex items-center space-x-1"><DollarSign className="w-3 h-3" /><span>R$ {rota.preco || 0}</span></div>
            </div>
        </CardContent>
    </Card>
  )

  const activeRoutes = rotas.filter(r => r.status !== 'Rascunho');
  const draftRoutes = rotas.filter(r => r.status === 'Rascunho');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/publisher/dashboard">
                <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <h1 className="text-xl font-semibold">Minhas Rotas</h1>
            </div>
            <Link href="/publisher/routes/create">
              <Button size="sm"><Plus className="w-4 h-4 mr-2" /> Nova Rota</Button>
            </Link>
          </div>

          <div className="flex space-x-2 mb-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar minhas rotas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="paused">Pausado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="p-4 pb-20">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Publicadas ({activeRoutes.length})</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos ({draftRoutes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {isLoading ? <p>A carregar...</p> : activeRoutes.length > 0 ? (
              <div className="space-y-4">
                {activeRoutes.map((rota) => (<RouteCard key={rota.id} rota={rota} />))}
              </div>
            ) : <p className="text-center text-gray-500 py-4">Nenhuma rota publicada.</p>}
          </TabsContent>

          <TabsContent value="drafts" className="mt-4">
             {isLoading ? <p>A carregar...</p> : draftRoutes.length > 0 ? (
              <div className="space-y-4">
                {draftRoutes.map((rota) => (<RouteCard key={rota.id} rota={rota} />))}
              </div>
            ) : <p className="text-center text-gray-500 py-4">Nenhum rascunho encontrado.</p>}
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation (mantido o original) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-gray-600"><TrendingUp className="w-5 h-5" /><span className="text-xs mt-1">Painel</span></Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-green-600"><MapPin className="w-5 h-5" /><span className="text-xs mt-1">Minhas Rotas</span></Link>
          <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Reservas</span></Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600"><Users className="w-5 h-5" /><span className="text-xs mt-1">Mensagens</span></Link>
        </div>
      </div>
    </div>
  )
}