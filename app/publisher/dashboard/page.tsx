"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { RouteGuard } from "@/components/RouteGuard"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, MessageSquare, Plus, Eye, Edit, Calendar, TrendingUp, LogOut } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Rota = {
  id: number;
  nome: string;
};

type Reserva = {
  id: number;
}

type Stats = {
  totalRotas: number;
  totalPlanos: number;
};

export default function PublisherDashboard() {
  const router = useRouter();
  const { user } = useUser();
  const [rotasRecentes, setRotasRecentes] = useState<Rota[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRotas: 0, totalPlanos: 0 });
  const [rotas, setRotas] = useState<Rota[]>([])
  const [reservas, setReservas] = useState<Reserva[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // Se não houver utilizador, não fazemos nada. O layout já trata do redirecionamento.
      if (!user?.id) return

      setIsLoading(true); // Garante que o estado de loading é ativado a cada nova busca

      // Busca as rotas do publicador
      const { data: rotasData, error: rotasError } = await supabase
        .from('rotas')
        .select('id, nome')
        .eq('publicador_id', user.id);

      // Busca as reservas para as rotas deste publicador
      // (Esta é uma consulta mais complexa, pode ser ajustada conforme a sua necessidade)
      const { data: reservasData, error: reservasError } = await supabase
        .from('reservas')
        .select('id, rotas!inner(publicador_id)')
        .eq('rotas.publicador_id', user.id);

      if (rotasError || reservasError) {
        console.error("Erro ao buscar dados do dashboard:", rotasError || reservasError);
      } else {
        setRotas(rotasData || []);
        setReservas(reservasData || []);
        // Adiciona a atualização dos estados que são usados na renderização
        setStats({
          totalRotas: rotasData?.length || 0,
          totalPlanos: reservasData?.length || 0,
        });
        setRotasRecentes(rotasData?.slice(0, 5) || []); // Exibe as 5 rotas mais recentes
      }

      setIsLoading(false); // Desativa o estado de loading após a busca
    }

    fetchData()
  }, [user?.id]) // A dependência no ID do utilizador é robusta e correta

  // Cards de estatísticas simplificados
  const statCards = [
    { title: "Minhas Rotas", value: stats.totalRotas, icon: Route, color: "bg-blue-500" },
    { title: "Planos Recebidos", value: stats.totalPlanos, icon: Users, color: "bg-green-500" },
  ];

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <div className="grid grid-cols-2 gap-4"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  return (
    <RouteGuard allowedRoles={["publicador"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold">Painel do Publicador</h1>
          </div>
          <Link href="/publisher/messages">
            <Button variant="ghost" size="sm" className="relative">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {statCards.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Link href="/publisher/routes/create"><Button className="w-full h-16 flex flex-col"><Plus className="w-5 h-5" /><span className="text-sm">Criar Rota</span></Button></Link>
            <Link href="/publisher/messages"><Button variant="outline" className="w-full h-16 flex flex-col"><MessageSquare className="w-5 h-5" /><span className="text-sm">Mensagens</span></Button></Link>
            <Link href="/publisher/plans"><Button variant="outline" className="w-full h-16 flex flex-col"><Calendar className="w-5 h-5" /><span className="text-sm">Ver Planos</span></Button></Link>
            <Link href="/publisher/analytics"><Button variant="outline" className="w-full h-16 flex flex-col"><TrendingUp className="w-5 h-5" /><span className="text-sm">Análises</span></Button></Link>
          </CardContent>
        </Card>

        {/* My Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Rotas Recentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rotasRecentes.length > 0
              ? rotasRecentes.map((rota) => (
                <div key={rota.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-sm">{rota.nome}</h4>
                  <div className="flex space-x-1">
                    <Link href={`/route-details/${rota.id}`}><Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button></Link>
                    <Link href={`/publisher/routes/edit/${rota.id}`}><Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button></Link>
                  </div>
                </div>
              ))
              : <p className="text-sm text-gray-500 text-center py-4">Ainda não criou nenhuma rota.</p>
            }
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-5 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-green-600"><TrendingUp className="w-5 h-5" /><span className="text-xs mt-1">Painel</span></Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600"><Route className="w-5 h-5" /><span className="text-xs mt-1">Minhas Rotas</span></Link>
          <Link href="/publisher/plans" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Planos</span></Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600"><MessageSquare className="w-5 h-5" /><span className="text-xs mt-1">Mensagens</span></Link>
          <button 
            onClick={async () => {
              await supabase.auth.signOut()
              router.push('/')
            }} 
            className="flex flex-col items-center py-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-xs mt-1">Sair</span>
          </button>
        </div>
      </div>
      </div>
    </RouteGuard>
  )
}