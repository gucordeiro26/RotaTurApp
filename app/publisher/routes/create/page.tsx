"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import dynamic from 'next/dynamic'
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Map, Save, Send, Trash2, Pin, Play, Flag } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Ponto } from "@/components/MapEditor"

type ModoEdicao = 'inicio' | 'fim' | 'interesse';

// Estado unificado para todos os campos do formulário
const initialState = {
  nome: "",
  descricao_curta: "",
  descricao: "",
  categoria: "historia",
  duracao: "2h",
  dificuldade: "Fácil",
  max_participantes: 20,
  preco: 0,
};

export default function CreateRoute() {
  const router = useRouter()
  const { user } = useUser()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState(initialState);

  const [pontoInicio, setPontoInicio] = useState<Ponto | null>(null);
  const [pontoFim, setPontoFim] = useState<Ponto | null>(null);
  const [pontosDeInteresse, setPontosDeInteresse] = useState<Ponto[]>([])
  const [modoEdicao, setModoEdicao] = useState<ModoEdicao>('interesse');

  const MapEditor = useMemo(() => dynamic(
    () => import('@/components/MapEditor'),
    {
      loading: () => <Skeleton className="w-full h-[400px] rounded-md" />,
      ssr: false
    }
  ), [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPonto = (ponto: Ponto) => {
    if (modoEdicao === 'inicio') setPontoInicio(ponto);
    else if (modoEdicao === 'fim') setPontoFim(ponto);
    else setPontosDeInteresse(prev => [...prev, ponto]);
  }

  const handleRemovePonto = (index: number) => {
    setPontosDeInteresse(prev => prev.filter((_, i) => i !== index));
  }

  const handleCreateRoute = async () => {
    if (!user) {
      setError("Precisa de estar autenticado para criar uma rota.");
      return;
    }
    if (!formData.nome) {
      setError("O nome da rota é obrigatório.");
      return;
    }

    setIsLoading(true);
    setError(null);

    // 1. Insere a rota principal com todos os campos
    const { data: rotaData, error: rotaError } = await supabase
      .from('rotas')
      .insert({
        ...formData,
        publicador_id: user.id,
        origem_coords: pontoInicio ? { lat: pontoInicio.lat, lng: pontoInicio.lng } : null,
        destino_coords: pontoFim ? { lat: pontoFim.lat, lng: pontoFim.lng } : null,
      })
      .select()
      .single();

    if (rotaError) {
      setError(`Erro ao criar a rota: ${rotaError.message}`);
      setIsLoading(false);
      return;
    }

    // 2. Insere os pontos de interesse
    if (rotaData && pontosDeInteresse.length > 0) {
      const pontosParaInserir = pontosDeInteresse.map(ponto => ({
        rota_id: rotaData.id,
        nome: ponto.nome || 'Ponto de Interesse',
        coords: { lat: ponto.lat, lng: ponto.lng },
      }));

      const { error: pontosError } = await supabase
        .from('pontos_interesse')
        .insert(pontosParaInserir);

      if (pontosError) {
        setError(`A rota foi criada, mas houve um erro ao guardar os pontos: ${pontosError.message}`);
        setIsLoading(false);
        return;
      }
    }

    alert("Rota publicada com sucesso!");
    router.push('/publisher/routes');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b flex-shrink-0">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/publisher/routes">
              <Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4" /></Button>
            </Link>
            <h1 className="text-xl font-semibold">Criar Nova Rota</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal com Rolagem */}
      <main className="flex-grow overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Card de Informações Gerais */}
          <Card>
            <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Rota *</Label>
                <Input id="nome" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao_curta">Descrição Curta</Label>
                <Input id="descricao_curta" value={formData.descricao_curta} onChange={(e) => handleInputChange('descricao_curta', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição Completa</Label>
                <Textarea id="descricao" value={formData.descricao} onChange={(e) => handleInputChange('descricao', e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(v) => handleInputChange('categoria', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="historia">História</SelectItem>
                      <SelectItem value="natureza">Natureza</SelectItem>
                      <SelectItem value="gastronomia">Gastronomia</SelectItem>
                      <SelectItem value="aventura">Aventura</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dificuldade">Dificuldade</Label>
                  <Select value={formData.dificuldade} onValueChange={(v) => handleInputChange('dificuldade', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Fácil">Fácil</SelectItem>
                      <SelectItem value="Moderado">Moderado</SelectItem>
                      <SelectItem value="Difícil">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço (R$)</Label>
                  <Input id="preco" type="number" value={formData.preco} onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duracao">Duração (ex: 2h)</Label>
                  <Input id="duracao" value={formData.duracao} onChange={(e) => handleInputChange('duracao', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_participantes">Max. Pessoas</Label>
                  <Input id="max_participantes" type="number" value={formData.max_participantes} onChange={(e) => handleInputChange('max_participantes', parseInt(e.target.value) || 0)} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center"><Map className="w-5 h-5 mr-2" /> Editor de Rota no Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button variant={modoEdicao === 'inicio' ? 'default' : 'outline'} onClick={() => setModoEdicao('inicio')}><Play className="w-4 h-4 mr-2" /> Definir Início</Button>
                  <Button variant={modoEdicao === 'fim' ? 'default' : 'outline'} onClick={() => setModoEdicao('fim')}><Flag className="w-4 h-4 mr-2" /> Definir Fim</Button>
                  <Button variant={modoEdicao === 'interesse' ? 'default' : 'outline'} onClick={() => setModoEdicao('interesse')}><Pin className="w-4 h-4 mr-2" /> Adicionar Ponto</Button>
                </div>

                <div className="w-full h-[400px] rounded-md overflow-hidden border">
                  <MapEditor
                    initialCenter={{ lat: -23.55052, lng: -46.633308 }} // exemplo: centro de São Paulo, ajuste conforme necessário
                    pontoInicio={pontoInicio}
                    pontoFim={pontoFim}
                    pontosInteresse={pontosDeInteresse}
                    onAddPonto={handleAddPonto}
                  />
                </div>

                <div className="space-y-3">
                  {pontoInicio && (
                    <div className="flex items-center justify-between p-2 bg-green-50 rounded-md">
                      <div className="flex items-center space-x-2 font-medium text-green-800 min-w-0"><Play className="h-4 w-4 flex-shrink-0" /><span className="truncate">{pontoInicio.nome || 'Ponto de Início'}</span></div>
                      <Button variant="ghost" size="sm" onClick={() => setPontoInicio(null)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  )}
                  {pontoFim && (
                    <div className="flex items-center justify-between p-2 bg-blue-50 rounded-md">
                      <div className="flex items-center space-x-2 font-medium text-blue-800 min-w-0"><Flag className="h-4 w-4 flex-shrink-0" /><span className="truncate">{pontoFim.nome || 'Ponto Final'}</span></div>
                      <Button variant="ghost" size="sm" onClick={() => setPontoFim(null)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  )}
                  {(pontosDeInteresse.length > 0) && (
                    <div className="space-y-2 pt-2">
                      <h4 className="font-medium text-sm">Pontos de Interesse:</h4>
                      {pontosDeInteresse.map((ponto, index) => (
                        <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-md list-none">
                          <div className="flex items-center space-x-2 min-w-0"><Pin className="h-4 w-4 text-gray-500 flex-shrink-0" /><span className="truncate">{ponto.nome || `Ponto #${index + 1}`}</span></div>
                          <Button variant="ghost" size="sm" onClick={() => handleRemovePonto(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </li>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          {error && <p className="text-sm font-medium text-red-500 p-4 bg-red-100 rounded-md">{error}</p>}
        </div>
      </main>

      {/* Rodapé com Botões de Ação */}
      <footer className="bg-white border-t p-4 flex-shrink-0">
        <div className="flex space-x-3">
          <Button variant="outline" className="flex-1" disabled={isLoading}><Save className="w-4 h-4 mr-2" /> Guardar Rascunho</Button>
          <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={handleCreateRoute} disabled={isLoading}>
            {isLoading ? 'A publicar...' : <><Send className="w-4 h-4 mr-2" /> Publicar Rota</>}
          </Button>
        </div>
      </footer>
    </div>
  )
}