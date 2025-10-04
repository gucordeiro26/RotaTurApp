"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, MessageSquare, Plus, Eye, Edit, Calendar, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Rota = {
  id: number;
  nome: string;
};

type Stats = {
  totalRotas: number;
  totalPlanos: number;
};

export default function PublisherDashboard() {
  const { user } = useUser();
  const [rotasRecentes, setRotasRecentes] = useState<Rota[]>([]);
  const [stats, setStats] = useState<Stats>({ totalRotas: 0, totalPlanos: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setIsLoading(true);

      // Busca as rotas do publicador
      const { data: rotasData, error: rotasError, count: rotasCount } = await supabase
        .from('rotas')
        .select('*', { count: 'exact' })
        .eq('publicador_id', user.id);

      if (rotasError) {
        console.error("Erro ao buscar rotas:", rotasError);
      } else {
        setRotasRecentes(rotasData?.slice(0, 3) || []);
        setStats(prev => ({ ...prev, totalRotas: rotasCount || 0 }));
      }

      // Busca os planos feitos para as rotas deste publicador
      if (rotasData) {
        const rotasIds = rotasData.map(rota => rota.id);
        if (rotasIds.length > 0) {
            const { count: planosCount, error: planosError } = await supabase
                .from('reservas')
                .select('*', { count: 'exact', head: true })
                .in('rota_id', rotasIds);

            if (planosError) {
                console.error("Erro ao buscar planos:", planosError);
            } else {
                setStats(prev => ({ ...prev, totalPlanos: planosCount || 0 }));
            }
        }
      }

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [user]);

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
                          <Button variant="ghost" size="sm"><Edit className="w-4 h-4" /></Button>
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
        <div className="grid grid-cols-4 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-green-600"><TrendingUp className="w-5 h-5" /><span className="text-xs mt-1">Painel</span></Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600"><Route className="w-5 h-5" /><span className="text-xs mt-1">Minhas Rotas</span></Link>
          <Link href="/publisher/plans" className="flex flex-col items-center py-2 text-gray-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Planos</span></Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600"><MessageSquare className="w-5 h-5" /><span className="text-xs mt-1">Mensagens</span></Link>
        </div>
      </div>
    </div>
  )
}