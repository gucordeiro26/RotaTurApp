"use client"

import { useState, useEffect, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  Clock,
  MapPin,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Estendemos o tipo Rota para incluir todos os campos que vamos usar
type Rota = {
  id: number
  nome: string
  preco: number
  duracao: string
  dificuldade: string
  criado_em: string // Renomeado para corresponder à coluna do Supabase
  status: string
  descricao_curta: string | null
  descricao: string | null
  categoria: string | null
  max_participantes: number | null
  origem_coords: any | null
  destino_coords: any | null
}

export default function PublisherRoutes() {
  const { user } = useUser()
  const router = useRouter(); // Adicionado para navegação
  const [activeTab, setActiveTab] = useState("active")
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Estado para controlar o diálogo de exclusão
  const [routeToDelete, setRouteToDelete] = useState<Rota | null>(null);

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

    if (user?.id) {
      fetchMinhasRotas()
    }
  }, [user?.id])

  // --- INÍCIO DA LÓGICA DE EXCLUSÃO ---
  const handleDeleteRoute = async () => {
    if (!routeToDelete) return;

    // 1. Exclui os pontos de interesse associados
    await supabase.from('pontos_interesse').delete().eq('rota_id', routeToDelete.id);
    // Adicionar aqui a exclusão de outras tabelas relacionadas (reservas, favoritos, etc.) se necessário

    // 2. Exclui a rota principal
    const { error: rotaError } = await supabase.from('rotas').delete().eq('id', routeToDelete.id);

    if (rotaError) {
      alert(`Erro ao excluir a rota: ${rotaError.message}`);
    } else {
      setRotas(prevRotas => prevRotas.filter(route => route.id !== routeToDelete.id));
      alert("Rota excluída com sucesso!");
    }
    setRouteToDelete(null); // Fecha o diálogo
  };
  // --- FIM DA LÓGICA DE EXCLUSÃO ---


  // --- INÍCIO DA LÓGICA DE DUPLICAÇÃO ---
  const handleDuplicateRoute = async (routeId: number) => {
    const routeToDuplicate = rotas.find(r => r.id === routeId);
    if (!routeToDuplicate) return;

    // 1. Busca a rota e os seus pontos de interesse
    const { data: fullRouteData, error: fetchError } = await supabase
      .from('rotas')
      .select(`*, pontos_interesse(*)`)
      .eq('id', routeId)
      .single();

    if (fetchError) {
      alert("Erro ao carregar dados da rota para duplicar.");
      return;
    }

    // 2. Prepara os dados da nova rota
    const { id, created_at, pontos_interesse, ...newRouteData } = fullRouteData;

    // 3. Insere a nova rota e obtém o seu novo ID
    const { data: insertedRoute, error: insertRouteError } = await supabase
      .from('rotas')
      .insert(newRouteData)
      .select()
      .single();

    if (insertRouteError || !insertedRoute) {
      alert(`Erro ao criar a rota duplicada: ${insertRouteError?.message}`);
      return;
    }

    // 4. Se a rota original tinha pontos, duplica-os para a nova rota
    const originalPontos = fullRouteData.pontos_interesse;
    if (originalPontos && originalPontos.length > 0) {
      const newPontos = originalPontos.map((ponto: any) => {
        const { id, rota_id, ...newPontoData } = ponto;
        return {
          ...newPontoData,
          rota_id: insertedRoute.id // Associa ao ID da nova rota
        };
      });

      const { error: insertPontosError } = await supabase
        .from('pontos_interesse')
        .insert(newPontos);

      if (insertPontosError) {
        alert(`A rota foi duplicada, mas houve um erro ao duplicar os pontos de interesse: ${insertPontosError.message}`);
      }
    }

    // 5. Adiciona a nova rota à lista na UI
    setRotas(prevRotas => [insertedRoute as Rota, ...prevRotas]);
    alert("Rota duplicada com sucesso!");
  }
  // --- FIM DA LÓGICA DE DUPLICAÇÃO ---


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

  // Componente de Card de Rota com as ações ligadas
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
              <DropdownMenuItem onSelect={() => router.push(`/route-details/${rota.id}`)}>
                <Eye className="w-4 h-4 mr-2" /> Ver Detalhes
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => router.push(`/publisher/routes/edit/${rota.id}`)}>
                <Edit className="w-4 h-4 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => handleDuplicateRoute(rota.id)}>
                <Copy className="w-4 h-4 mr-2" /> Duplicar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600" onSelect={() => setRouteToDelete(rota)}>
                <Trash2 className="w-4 h-4 mr-2" /> Excluir
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

  const filteredRoutes = useMemo(() => {
    return rotas.filter(rota => {
      const matchesSearch = rota.nome.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || (rota.status && rota.status.toLowerCase() === statusFilter);
      return matchesSearch && matchesStatus;
    });
  }, [rotas, searchTerm, statusFilter]);

  const activeRoutes = filteredRoutes.filter(r => r.status !== 'Rascunho');
  const draftRoutes = filteredRoutes.filter(r => r.status === 'Rascunho');

  return (
    <>
      <div className="min-h-screen bg-gray-50">
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
                <Input placeholder="Buscar minhas rotas..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Ativo">Ativo</SelectItem>
                  <SelectItem value="Pausado">Pausado</SelectItem>
                  <SelectItem value="Rascunho">Rascunho</SelectItem>
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

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <div className="grid grid-cols-4 py-2">
            <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-gray-600"><TrendingUp className="w-5 h-5" /><span className="text-xs mt-1">Painel</span></Link>
            <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-green-600"><MapPin className="w-5 h-5" /><span className="text-xs mt-1">Minhas Rotas</span></Link>
            <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Reservas</span></Link>
            <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600"><Users className="w-5 h-5" /><span className="text-xs mt-1">Mensagens</span></Link>
          </div>
        </div>
      </div>

      {/* --- Diálogo de Confirmação de Exclusão --- */}
      <AlertDialog open={routeToDelete !== null} onOpenChange={() => setRouteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
              Tem certeza que deseja excluir esta rota?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isto irá excluir permanentemente a rota
              <span className="font-bold"> "{routeToDelete?.nome}" </span>
              e todos os seus dados associados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoute}>
              Sim, excluir rota
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}