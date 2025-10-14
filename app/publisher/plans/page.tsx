"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Check, X, Clock, Calendar, User, AlertCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

// Tipos para estruturar os dados que vêm da base de dados
type Plan = {
  id: number;
  data_reserva: string;
  participantes: number;
  status: 'pendente' | 'confirmado' | 'cancelado';
  rotas: {
    nome: string;
  } | null;
  perfis: {
    nome_completo: string | null;
    url_avatar: string | null;
  } | null;
}

export default function PublisherPlansPage() {
  const { user } = useUser();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      if (!user?.id) return;

      setIsLoading(true);

      // Consulta que busca os 'plans' e junta os dados das tabelas 'rotas' e 'perfis'
      const { data, error } = await supabase
        .from('reservas')
        .select(`
                    id,
                    data_reserva,
                    participantes,
                    status,
                    rotas!inner ( nome ),
                    perfis!inner ( nome_completo, url_avatar )
                `)
        .in('rota_id', (await supabase.from('rotas').select('id').eq('publicador_id', user.id)).data?.map(r => r.id) || [])
        .order('data_reserva', { ascending: true });

      if (error) {
        console.error("Erro ao buscar os planos:", error);
        setError("Não foi possível carregar as reservas. Tente novamente mais tarde.");
      } else if (data) {
        const formattedData = data.map(plan => ({
          ...plan,
          rotas: Array.isArray(plan.rotas) ? plan.rotas[0] || null : plan.rotas,
          perfis: Array.isArray(plan.perfis) ? plan.perfis[0] || null : plan.perfis,
        }));
        setPlans(formattedData as Plan[]);
      }
      setIsLoading(false);
    };

    fetchPlans();
  }, [user?.id]);

  // Função para atualizar o status de um plano
  const handleUpdateStatus = async (planId: number, newStatus: 'confirmado' | 'cancelado') => {
    // Encontra o plano no estado local para atualizar a UI otimisticamente
    const originalPlans = plans;
    const updatedPlans = plans.map(p => p.id === planId ? { ...p, status: newStatus } : p);
    setPlans(updatedPlans);

    const { error } = await supabase
      .from('reservas')
      .update({ status: newStatus })
      .eq('id', planId);

    if (error) {
      alert(`Erro ao atualizar o status: ${error.message}`);
      setPlans(originalPlans); // Reverte a alteração na UI se houver erro
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'confirmado': return 'default';
      case 'pendente': return 'secondary';
      case 'cancelado': return 'destructive';
      default: return 'outline';
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
        <Card><CardContent className="p-4"><Skeleton className="h-12 w-full" /></CardContent></Card>
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 flex flex-col items-center gap-4"><AlertCircle size={48} /><span>{error}</span></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Gerir Reservas (Plans)</h1>

      {plans.length === 0 ? (
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle>Nenhuma reserva encontrada</CardTitle>
            <CardDescription>Quando os utilizadores se inscreverem nas suas rotas, as reservas aparecerão aqui.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <Avatar>
                    <AvatarImage src={plan.perfis?.url_avatar || undefined} />
                    <AvatarFallback>{plan.perfis?.nome_completo?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="grid gap-1 text-sm">
                    <p className="font-semibold">{plan.perfis?.nome_completo || "Utilizador anónimo"}</p>
                    <p className="text-muted-foreground font-medium">{plan.rotas?.nome || "Rota desconhecida"}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(plan.data_reserva).toLocaleDateString('pt-BR')}</span>
                      <span className="flex items-center gap-1"><User size={14} /> {plan.participantes} participante(s)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Badge variant={getStatusVariant(plan.status)} className="capitalize w-24 justify-center hidden sm:flex">
                    {plan.status}
                  </Badge>
                  {plan.status === 'pendente' && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleUpdateStatus(plan.id, 'cancelado')}>
                        <X className="w-4 h-4 mr-2" /> Cancelar
                      </Button>
                      <Button size="sm" className="flex-1" onClick={() => handleUpdateStatus(plan.id, 'confirmado')}>
                        <Check className="w-4 h-4 mr-2" /> Confirmar
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}