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
  Clock,
  DollarSign,
  AlertCircle,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Rota = {
  id: number
  nome: string
  preco: number
  duracao: string
  dificuldade: string
  criado_em: string
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
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("active")
  const [rotas, setRotas] = useState<Rota[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [routeToDelete, setRouteToDelete] = useState<Rota | null>(null);

  useEffect(() => {
    const fetchMinhasRotas = async () => {
      if (!user) return

      setIsLoading(true)
      const { data, error } = await supabase
        .from('rotas')
        .select('*')
        .eq('publicador_id', user.id)
        .order('criado_em', { ascending: false });

      if (error) {
        console.error("Erro ao buscar rotas do publicador:", error)
      } else {
        setRotas(data as Rota[] || [])
      }
      setIsLoading(false)
    }

    if (user) {
      fetchMinhasRotas()
    }
  }, [user])

  const handleDeleteRoute = async () => {
    if (!routeToDelete) return;
    await supabase.from('pontos_interesse').delete().eq('rota_id', routeToDelete.id);
    const { error: rotaError } = await supabase.from('rotas').delete().eq('id', routeToDelete.id);
    if (rotaError) {
      alert(`Erro ao excluir a rota: ${rotaError.message}`);
    } else {
      setRotas(prevRotas => prevRotas.filter(route => route.id !== routeToDelete.id));
      alert("Rota excluída com sucesso!");
    }
    setRouteToDelete(null);
  };

  const handleDuplicateRoute = async (routeId: number) => {
    const { data: fullRouteData, error: fetchError } = await supabase
      .from('rotas')
      .select(`*, pontos_interesse(*)`)
      .eq('id', routeId)
      .single();

    if (fetchError) return;

    const { id, criado_em, pontos_interesse, ...newRouteData } = fullRouteData;
    newRouteData.nome = `${newRouteData.nome} (Cópia)`;
    newRouteData.status = 'Rascunho';

    const { data: insertedRoute, error: insertRouteError } = await supabase
      .from('rotas')
      .insert(newRouteData)
      .select()
      .single();

    if (insertRouteError || !insertedRoute) return;

    if (pontos_interesse && pontos_interesse.length > 0) {
      const newPontos = pontos_interesse.map((ponto: any) => {
        const { id, rota_id, ...newPontoData } = ponto;
        return { ...newPontoData, rota_id: insertedRoute.id };
      });
      await supabase.from('pontos_interesse').insert(newPontos);
    }
    setRotas(prevRotas => [insertedRoute as Rota, ...prevRotas]);
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo": return "bg-green-100 text-green-800"
      case "Pausado": return "bg-yellow-100 text-yellow-800"
      case "Rascunho": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const RouteCard = ({ rota }: { rota: Rota }) => (
    <Card className="overflow-hidden">
      <CardContent className="flex-1 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-3 gap-3">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm line-clamp-1">{rota.nome}</h3>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0"><MoreVertical className="w-4 h-4" /></Button>
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
            <div className="flex items-center space-x-2 mb-1">
              <Badge className={`text-[10px] ${getStatusColor(rota.status || 'Rascunho')}`}>{rota.status || 'Rascunho'}</Badge>
              <Badge variant="outline" className="text-[10px]">{rota.dificuldade}</Badge>
            </div>
            <p className="text-xs text-gray-500">Criado em {new Date(rota.criado_em).toLocaleDateString("pt-BR")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 pt-2 border-t">
          <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{rota.duracao || 'N/A'}</span></div>
          <div className="flex items-center space-x-1 justify-end text-green-700 font-medium"><DollarSign className="w-3 h-3" /><span>Gratuito</span></div>
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Link href="/publisher/dashboard">
                <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
              </Link>
              <h1 className="text-lg font-semibold">Minhas Rotas</h1>
            </div>
            <Link href="/publisher/routes/create">
              <Button size="sm"><Plus className="w-4 h-4 mr-0 sm:mr-2" /><span className="hidden sm:inline">Nova Rota</span></Button>
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Buscar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-32"><SelectValue /></SelectTrigger>
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

      <div className="p-4 pb-20 flex-1 max-w-7xl mx-auto w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Publicadas ({activeRoutes.length})</TabsTrigger>
            <TabsTrigger value="drafts">Rascunhos ({draftRoutes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            {isLoading ? <p>A carregar...</p> : activeRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeRoutes.map((rota) => (<RouteCard key={rota.id} rota={rota} />))}
              </div>
            ) : <p className="text-center text-gray-500 py-4">Nenhuma rota publicada.</p>}
          </TabsContent>

          <TabsContent value="drafts">
            {isLoading ? <p>A carregar...</p> : draftRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {draftRoutes.map((rota) => (<RouteCard key={rota.id} rota={rota} />))}
              </div>
            ) : <p className="text-center text-gray-500 py-4">Nenhum rascunho encontrado.</p>}
          </TabsContent>
        </Tabs>
      </div>

      <AlertDialog open={routeToDelete !== null} onOpenChange={() => setRouteToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem a certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A rota <b>{routeToDelete?.nome}</b> será excluída permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoute} className="bg-red-600 hover:bg-red-700">Sim, excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}