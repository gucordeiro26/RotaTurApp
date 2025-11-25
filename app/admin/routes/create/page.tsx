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
import { ArrowLeft, Map, Save, Trash2, Pin, Play, Flag, Loader2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { Ponto } from "@/components/MapEditor"

type ModoEdicaoMapa = 'inicio' | 'fim' | 'interesse';

export default function AdminCreateRoutePage() {
  const router = useRouter();
  const { user } = useUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [descricaoCurta, setDescricaoCurta] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("historia");
  const [dificuldade, setDificuldade] = useState("Fácil");
  const [duracao, setDuracao] = useState("");
  const [maxParticipantes, setMaxParticipantes] = useState(0);
  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);

  const [pontoInicio, setPontoInicio] = useState<Ponto | null>(null);
  const [pontoFim, setPontoFim] = useState<Ponto | null>(null);
  const [pontosDeInteresse, setPontosDeInteresse] = useState<Ponto[]>([]);
  const [modoEdicaoMapa, setModoEdicaoMapa] = useState<ModoEdicaoMapa>('interesse');

  const MapEditor = useMemo(() => dynamic(
    () => import('@/components/MapEditor'),
    {
      loading: () => <Skeleton className="w-full h-[400px] rounded-md" />,
      ssr: false
    }
  ), []);

  const handleAddPonto = (ponto: Ponto) => {
    if (modoEdicaoMapa === 'inicio') setPontoInicio(ponto);
    else if (modoEdicaoMapa === 'fim') setPontoFim(ponto);
    else setPontosDeInteresse(prev => [...prev, ponto]);
  }

  const handleRemovePontoInteresse = (index: number) => {
    setPontosDeInteresse(prev => prev.filter((_, i) => i !== index));
  }

  const uploadImagem = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { error: uploadError } = await supabase.storage.from('rotas').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('rotas').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error("Erro no upload:", error);
      return null;
    }
  }

  const handleSubmitRoute = async () => {
    if (!user || !nome) {
      setError("O nome da rota é obrigatório.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    let imagemUrl = null;
    if (imagemArquivo) {
      imagemUrl = await uploadImagem(imagemArquivo);
      if (!imagemUrl) {
        setError("Erro ao fazer upload da imagem. Tente novamente.");
        setIsSubmitting(false);
        return;
      }
    }

    const { data: newRoute, error: insertRouteError } = await supabase
      .from('rotas')
      .insert({
        nome,
        descricao_curta: descricaoCurta,
        descricao,
        categoria,
        dificuldade,
        duracao,
        max_participantes: maxParticipantes,
        publicador_id: user.id,
        origem_coords: pontoInicio,
        destino_coords: pontoFim,
        status: 'Ativo',
        imagem_url: imagemUrl
      })
      .select('id')
      .single();

    if (insertRouteError || !newRoute) {
      setError(`Erro ao criar a rota: ${insertRouteError?.message}`);
      setIsSubmitting(false);
      return;
    }

    if (pontosDeInteresse.length > 0) {
      const pontosParaInserir = pontosDeInteresse.map(ponto => ({
        rota_id: newRoute.id,
        nome: ponto.nome || 'Ponto de Interesse',
        coords: { lat: ponto.lat, lng: ponto.lng },
      }));
      await supabase.from('pontos_interesse').insert(pontosParaInserir);
    }

    alert("Rota criada com sucesso!");
    router.push('/admin/routes');
  };

  return (
    // Adicionado overflow-x-hidden para prevenir scroll horizontal na página toda
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-x-hidden">
      <header className="bg-white shadow-sm border-b flex-shrink-0 sticky top-0 z-10">
        <div className="px-4 py-3 flex items-center space-x-3 max-w-7xl mx-auto w-full">
          <Link href="/admin/routes">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <h1 className="text-lg sm:text-xl font-semibold truncate">Criar Nova Rota</h1>
        </div>
      </header>

      <main className="flex-grow overflow-y-auto p-4 space-y-6 pb-24 w-full max-w-7xl mx-auto">
        <Card>
          <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="imagem">Imagem da Capa</Label>
              <Input id="imagem" type="file" accept="image/*" onChange={(e) => setImagemArquivo(e.target.files?.[0] || null)} className="cursor-pointer" />
            </div>

            <div className="space-y-2"><Label htmlFor="nome">Nome da Rota *</Label><Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="descricao_curta">Descrição Curta</Label><Input id="descricao_curta" value={descricaoCurta} onChange={(e) => setDescricaoCurta(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="descricao">Descrição Completa</Label><Textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} /></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="categoria">Categoria</Label><Select value={categoria} onValueChange={setCategoria}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="historia">História</SelectItem><SelectItem value="natureza">Natureza</SelectItem><SelectItem value="gastronomia">Gastronomia</SelectItem><SelectItem value="aventura">Aventura</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="dificuldade">Dificuldade</Label><Select value={dificuldade} onValueChange={setDificuldade}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Fácil">Fácil</SelectItem><SelectItem value="Moderado">Moderado</SelectItem><SelectItem value="Difícil">Difícil</SelectItem></SelectContent></Select></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label htmlFor="duracao">Duração</Label><Input id="duracao" value={duracao} onChange={(e) => setDuracao(e.target.value)} placeholder="Ex: 2 horas" /></div>
              <div className="space-y-2"><Label htmlFor="max_participantes">Máx. de Pessoas</Label><Input id="max_participantes" type="number" value={maxParticipantes} onChange={(e) => setMaxParticipantes(parseInt(e.target.value) || 0)} /></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center"><Map className="w-5 h-5 mr-2" /> Editor de Rota no Mapa</CardTitle></CardHeader>
          <CardContent className="space-y-4 p-4"> {/* Padding reduzido para mobile */}

            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button className="w-full sm:w-auto" variant={modoEdicaoMapa === 'inicio' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('inicio')}><Play className="w-4 h-4 mr-2" /> Início</Button>
              <Button className="w-full sm:w-auto" variant={modoEdicaoMapa === 'fim' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('fim')}><Flag className="w-4 h-4 mr-2" /> Fim</Button>
              <Button className="w-full sm:w-auto" variant={modoEdicaoMapa === 'interesse' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('interesse')}><Pin className="w-4 h-4 mr-2" /> Ponto (+)</Button>
            </div>

            <div className="w-full h-[400px] rounded-md overflow-hidden border relative z-0">
              <MapEditor
                initialCenter={{ lat: -23.3557, lng: -47.8569 }}
                pontoInicio={pontoInicio}
                pontoFim={pontoFim}
                pontosInteresse={pontosDeInteresse}
                onAddPonto={handleAddPonto}
              />
            </div>

            {/* LISTA DE PONTOS COM LAYOUT BLINDADO CONTRA QUEBRA */}
            <div className="space-y-2 w-full max-w-full">
              {pontoInicio && (
                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md text-sm w-full gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <Play className="h-4 w-4 text-green-700 flex-shrink-0" />
                    {/* truncate é essencial aqui */}
                    <span className="font-medium text-green-800 truncate block w-full">
                      {pontoInicio.nome || 'Ponto de Início'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0" onClick={() => setPontoInicio(null)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
              {pontoFim && (
                <div className="flex items-center justify-between p-2 bg-red-50 rounded-md text-sm w-full gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <Flag className="h-4 w-4 text-red-700 flex-shrink-0" />
                    <span className="font-medium text-red-800 truncate block w-full">
                      {pontoFim.nome || 'Ponto Final'}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0" onClick={() => setPontoFim(null)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              )}
              {pontosDeInteresse.map((ponto, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md text-sm w-full gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <Pin className="h-4 w-4 text-gray-600 flex-shrink-0" />
                    <span className="text-gray-700 truncate block w-full">
                      {ponto.nome || `Ponto #${index + 1}`}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" className="flex-shrink-0 h-8 w-8 p-0" onClick={() => handleRemovePontoInteresse(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {error && <p className="text-sm font-medium text-red-500 p-4 bg-red-100 rounded-md">{error}</p>}
      </main>

      <footer className="bg-white border-t p-4 flex-shrink-0">
        <div className="flex justify-end space-x-3 max-w-7xl mx-auto w-full">
          <Button variant="outline" disabled={isSubmitting} onClick={() => router.back()}>Cancelar</Button>
          <Button onClick={handleSubmitRoute} disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> A guardar...</> : <><Save className="w-4 h-4 mr-2" /> Guardar Rota</>}
          </Button>
        </div>
      </footer>
    </div>
  )
}