"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  MessageSquare,
  CheckCircle,
  XCircle,
  TrendingUp,
  MapPin,
  Route as RouteIcon, // Renomeado para evitar conflito de nome
} from "lucide-react"
import Link from "next/link"

// --- INÍCIO DA CORREÇÃO ---
type PerfilDoUsuario = {
  nome_completo: string
  url_avatar: string | null
}

type RotaDoPlano = {
  nome: string
}

type PlanoRecebido = {
  id: number
  data_reserva: string
  participantes: number
  status: string
  // Os dados aninhados agora são corretamente tipados como arrays
  perfis: PerfilDoUsuario[] | null
  rotas: RotaDoPlano[] | null
}
// --- FIM DA CORREÇÃO ---


export default function PublisherPlans() {
  const { user } = useUser()
  const [planos, setPlanos] = useState<PlanoRecebido[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchReceivedPlans = async () => {
      if (!user) return
      setIsLoading(true)

      const { data: rotasDoPublicador, error: rotasError } = await supabase
        .from('rotas')
        .select('id')
        .eq('publicador_id', user.id)
      
      if (rotasError || !rotasDoPublicador) {
        console.error("Erro ao buscar rotas do publicador:", rotasError)
        setIsLoading(false)
        return
      }

      const rotasIds = rotasDoPublicador.map(r => r.id)

      if (rotasIds.length === 0) {
          setIsLoading(false)
          return
      }

      const { data: planosData, error: planosError } = await supabase
        .from('reservas')
        .select(`
          id, data_reserva, participantes, status,
          perfis ( nome_completo, url_avatar ),
          rotas ( nome )
        `)
        .in('rota_id', rotasIds)
        .order('criado_em', { ascending: false })

      if (planosError) {
        console.error("Erro ao buscar planos recebidos:", planosError)
      } else {
        // Agora o 'as any' é seguro porque a estrutura de dados é mais complexa
        setPlanos(planosData as any[] || [])
      }

      setIsLoading(false)
    }

    fetchReceivedPlans()
  }, [user])

  const handleUpdateStatus = async (planoId: number, newStatus: 'confirmado' | 'recusado') => {
    alert(`A funcionalidade de ${newStatus} o plano #${planoId} será implementada a seguir.`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 py-3 flex items-center space-x-3">
          <Link href="/publisher/dashboard">
            <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-xl font-semibold">Planos Recebidos</h1>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-24">
        {isLoading ? (
          <p>A carregar planos...</p>
        ) : planos.length > 0 ? (
          planos.map(plano => (
            <Card key={plano.id}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Avatar>
                    {/* --- CORREÇÃO AQUI: Aceder ao primeiro item do array --- */}
                    <AvatarImage src={plano.perfis?.[0]?.url_avatar || "/placeholder.svg"} />
                    <AvatarFallback>{plano.perfis?.[0]?.nome_completo?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-sm">{plano.perfis?.[0]?.nome_completo}</h3>
                        <p className="text-xs text-gray-600">{plano.rotas?.[0]?.nome}</p>
                      </div>
                      <Badge variant={plano.status === 'confirmado' ? 'default' : 'secondary'}>{plano.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-4">
                      <div className="flex items-center space-x-1"><Calendar className="w-3 h-3" /><span>{new Date(plano.data_reserva).toLocaleDateString("pt-BR")}</span></div>
                      <div className="flex items-center space-x-1"><Users className="w-3 h-3" /><span>{plano.participantes} pessoa(s)</span></div>
                    </div>

                    {plano.status === 'pendente' && (
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1 h-8 text-xs bg-green-600 hover:bg-green-700" onClick={() => handleUpdateStatus(plano.id, 'confirmado')}>
                          <CheckCircle className="w-3 h-3 mr-1" /> Confirmar
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 h-8 text-xs text-red-600" onClick={() => handleUpdateStatus(plano.id, 'recusado')}>
                          <XCircle className="w-3 h-3 mr-1" /> Recusar
                        </Button>
                        <Button variant="outline" size="sm" className="h-8"><MessageSquare className="w-3 h-3" /></Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">Nenhuma solicitação de plano</h3>
              <p className="text-sm text-gray-600">Quando os usuários planearem uma das suas rotas, as solicitações aparecerão aqui.</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="grid grid-cols-4 py-2">
            <Link href="/publisher/dashboard" className="flex flex-col items-center py-2 text-gray-600"><TrendingUp className="w-5 h-5" /><span className="text-xs mt-1">Painel</span></Link>
            <Link href="/publisher/routes" className="flex flex-col items-center py-2 text-gray-600"><MapPin className="w-5 h-5" /><span className="text-xs mt-1">Minhas Rotas</span></Link>
            <Link href="/publisher/plans" className="flex flex-col items-center py-2 text-green-600"><Calendar className="w-5 h-5" /><span className="text-xs mt-1">Planos</span></Link>
            <Link href="/publisher/messages" className="flex flex-col items-center py-2 text-gray-600"><MessageSquare className="w-5 h-5" /><span className="text-xs mt-1">Mensagens</span></Link>
        </div>
      </div>
    </div>
  )
}