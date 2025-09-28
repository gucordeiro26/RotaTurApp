"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Importamos o router para redirecionar
import { supabase } from "@/lib/supabase" // Importamos o Supabase
import { useUser } from "@/app/contexts/UserContext" // Importamos o hook do usuário
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, MapPin, Camera, Plus, X, Map, Save, Send } from "lucide-react"
import Link from "next/link"

export default function CreateRoute() {
  const router = useRouter()
  const { user } = useUser() // Pegamos o usuário logado para saber o publicador_id
  
  // Estados para controlar o formulário e feedback
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Estado para guardar todos os dados do formulário
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    descricao_curta: "",
    categoria: "historia",
    duracao: "2h",
    dificuldade: "easy",
    max_participantes: 20,
    preco: 0,
  })

  // Função para lidar com a submissão do formulário
  const handleCreateRoute = async () => {
    if (!user) {
      setError("Você precisa estar logado para criar uma rota.")
      return
    }
    if (!formData.nome) {
        setError("O nome da rota é obrigatório.")
        return
    }

    setIsLoading(true)
    setError(null)

    const { error: insertError } = await supabase.from('rotas').insert({
      // Mapeamos os dados do formulário para as colunas da tabela
      nome: formData.nome,
      descricao: formData.descricao,
      descricao_curta: formData.descricao_curta,
      categoria: formData.categoria,
      duracao: formData.duracao,
      dificuldade: formData.dificuldade,
      max_participantes: formData.max_participantes,
      preco: formData.preco,
      publicador_id: user.id, // Associamos a rota ao usuário logado
    })

    if (insertError) {
      setError(`Erro ao criar a rota: ${insertError.message}`)
      setIsLoading(false)
    } else {
      // Sucesso! Redireciona o usuário para a lista de rotas dele.
      alert("Rota criada com sucesso!")
      router.push('/publisher/routes')
    }
  }
  
  // Função para atualizar o estado do formulário
  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({...prev, [field]: value}))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/publisher/routes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Criar Nova Rota</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6 pb-24">
        {/* Usamos apenas a parte de Informações Básicas por enquanto */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informações da Rota</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="routeName">Nome da Rota *</Label>
              <Input
                id="routeName"
                placeholder="Ex: Caminhada pelo Centro Histórico"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription">Descrição Curta</Label>
              <Input
                id="shortDescription"
                placeholder="Resumo em uma linha para atrair visitantes"
                value={formData.descricao_curta}
                onChange={(e) => handleInputChange('descricao_curta', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição Completa</Label>
              <Textarea
                id="description"
                placeholder="Descreva sua rota em detalhes..."
                rows={4}
                value={formData.descricao}
                onChange={(e) => handleInputChange('descricao', e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="price">Preço por Pessoa (R$)</Label>
                    <Input id="price" type="number" placeholder="25.00" value={formData.preco} onChange={(e) => handleInputChange('preco', Number(e.target.value))}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Máximo de Participantes</Label>
                    <Input id="maxParticipants" type="number" placeholder="20" value={formData.max_participantes} onChange={(e) => handleInputChange('max_participantes', Number(e.target.value))}/>
                </div>
            </div>
            {/* Adicione outros campos do formulário aqui, ligando-os ao estado 'formData' */}

          </CardContent>
        </Card>

        {error && <p className="text-sm font-medium text-red-500 p-4 bg-red-100 rounded-md">{error}</p>}
      </div>

      {/* Fixed Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700" 
            onClick={handleCreateRoute}
            disabled={isLoading}
          >
            {isLoading ? 'Publicando...' : (
                <>
                    <Send className="w-4 h-4 mr-2" />
                    Publicar Rota
                </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}