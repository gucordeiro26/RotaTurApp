"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Route, MessageSquare, Plus, Eye, Edit, Calendar, DollarSign, TrendingUp } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

// Definimos um tipo para nossas rotas para ajudar o TypeScript
type Rota = {
  id: number;
  nome: string;
  // No futuro, podemos adicionar mais campos como status, reservas, etc.
};

// Definimos um tipo para as estatísticas do painel
type Stats = {
  totalRotas: number;
  totalReservas: number; // Manteremos em 0 por enquanto
  receita: number; // Manteremos em 0 por enquanto
  mensagens: number; // Manteremos em 5 por enquanto
};

export default function PublisherDashboard() {
  const { user } = useUser();
  const [rotasRecentes, setRotasRecentes] = useState<Rota[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalRotas: 0,
    totalReservas: 0,
    receita: 0,
    mensagens: 5
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Garante que só vamos buscar os dados se o usuário estiver carregado
      if (!user) return;

      setIsLoading(true);

      // Busca as rotas criadas pelo publicador logado
      const { data, error } = await supabase
        .from('rotas')
        .select('id, nome') // Pedimos apenas os campos que vamos usar
        .eq('publicador_id', user.id)
        .order('criado_em', { ascending: false }) // Ordena para mostrar as mais recentes primeiro
        .limit(3); // Pegamos apenas as 3 mais recentes para o painel

      if (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } else {
        setRotasRecentes(data || []);
        // Para o total de rotas, precisaríamos de outra consulta sem o limit,
        // mas por simplicidade vamos usar o tamanho do array por enquanto.
        // O ideal seria fazer uma contagem direto no DB.
        setStats(prevStats => ({ ...prevStats, totalRotas: data?.length || 0 }));
      }

      // No futuro, aqui também buscaremos os dados de reservas e receita.

      setIsLoading(false);
    };

    fetchDashboardData();
  }, [user]); // A dependência [user] garante que a busca só acontece quando o usuário é conhecido

  // Array para renderizar os cards de estatísticas, agora usando o estado 'stats'
  const statCards = [
    { title: "Minhas Rotas", value: stats.totalRotas, icon: Route, color: "bg-blue-500" },
    { title: "Total de Reservas", value: stats.totalReservas, icon: Users, color: "bg-green-500" },
    { title: "Receita", value: `R$ ${stats.receita.toFixed(2)}`, icon: DollarSign, color: "bg-purple-500" },
    { title: "Mensagens", value: stats.mensagens, icon: MessageSquare, color: "bg-orange-500" },
  ];

  // Mostra uma tela de carregamento enquanto os dados não chegam
  if (isLoading) {
    return (
        <div className="p-4 space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
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
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
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
            <Link href="/publisher/routes/create">
              <Button className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Plus className="w-5 h-5" />
                <span className="text-sm">Criar Rota</span>
              </Button>
            </Link>
            <Link href="/publisher/messages">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <MessageSquare className="w-5 h-5" />
                <span className="text-sm">Mensagens</span>
              </Button>
            </Link>
            <Link href="/publisher/bookings">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <Calendar className="w-5 h-5" />
                <span className="text-sm">Reservas</span>
              </Button>
            </Link>
            <Link href="/publisher/analytics">
              <Button variant="outline" className="w-full h-16 flex flex-col items-center justify-center space-y-1">
                <TrendingUp className="w-5 h-5" />
                <span className="text-sm">Análises</span>
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* My Routes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Minhas Rotas Recentes</CardTitle>
            <CardDescription>Gerencie suas rotas publicadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {rotasRecentes.length > 0 
                ? rotasRecentes.map((rota) => (
                    <div key={rota.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                        <h4 className="font-medium text-sm">{rota.nome}</h4>
                        {/* Outros detalhes como status, reservas, etc. virão no futuro */}
                        </div>
                        <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                            <Eye className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Edit className="w-3 h-3" />
                        </Button>
                        </div>
                    </div>
                ))
                : (
                    <p className="text-sm text-gray-500 text-center py-4">Você ainda não tem rotas publicadas.</p>
                )
            }
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
          <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="text-xs mt-1">Painel</span>
          </Link>
          <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600">
            <Route className="w-5 h-5" />
            <span className="text-xs mt-1">Minhas Rotas</span>
          </Link>
          <Link href="/publisher/bookings" className="flex flex-col items-center py-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <span className="text-xs mt-1">Reservas</span>
          </Link>
          <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs mt-1">Mensagens</span>
          </Link>
        </div>
      </div>
    </div>
  )
}