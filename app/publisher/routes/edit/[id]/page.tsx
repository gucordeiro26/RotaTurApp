"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import dynamic from 'next/dynamic'
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Map, Save, Trash2, Pin, Play, Flag, Loader2 } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import type { Ponto } from "@/components/MapEditor"

type ModoEdicaoMapa = 'inicio' | 'fim' | 'interesse';

type FormData = {
    nome: string;
    descricao_curta: string;
    descricao: string;
    categoria: string;
    duracao: string;
    dificuldade: string;
    max_participantes: number;
    preco: number;
    status: string;
}

export default function EditRoutePage() {
    const router = useRouter();
    const params = useParams();
    const { user } = useUser();
    const routeId = params.id as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const [formData, setFormData] = useState<FormData | null>(null);
    const [pontoInicio, setPontoInicio] = useState<Ponto | null>(null);
    const [pontoFim, setPontoFim] = useState<Ponto | null>(null);
    const [pontosDeInteresse, setPontosDeInteresse] = useState<Ponto[]>([]);
    const [initialCenter, setInitialCenter] = useState<{ lat: number; lng: number } | null>(null);
    const [modoEdicaoMapa, setModoEdicaoMapa] = useState<ModoEdicaoMapa>('interesse');

    const MapEditor = useMemo(() => dynamic(
        () => import('@/components/MapEditor'),
        {
            loading: () => <Skeleton className="w-full h-[400px] rounded-md" />,
            ssr: false
        }
    ), []);

    useEffect(() => {
        const fetchRouteData = async () => {
            if (!routeId || !user) return;

            const { data, error } = await supabase
                .from('rotas')
                .select(`*, pontos_interesse(*)`)
                .eq('id', routeId)
                .eq('publicador_id', user.id)
                .single();

            if (error || !data) {
                setError("Rota não encontrada ou não tem permissão para a editar.");
                setIsLoading(false);
                return;
            }

            setFormData({
                nome: data.nome || "",
                descricao_curta: data.descricao_curta || "",
                descricao: data.descricao || "",
                categoria: data.categoria || "historia",
                duracao: data.duracao || "",
                dificuldade: data.dificuldade || "Fácil",
                max_participantes: data.max_participantes || 0,
                preco: data.preco || 0,
                status: data.status || "Rascunho",
            });
            
            setPontoInicio(data.origem_coords);
            setPontoFim(data.destino_coords);
            
            const pontosValidos = data.pontos_interesse
                .filter((p: any) => p.coords && typeof p.coords === 'object' && 'lat' in p.coords && 'lng' in p.coords)
                .map((p: any) => ({
                    id: p.id,
                    lat: p.coords.lat,
                    lng: p.coords.lng,
                    nome: p.nome
                }));
            setPontosDeInteresse(pontosValidos);

            const TATUI_CENTER = { lat: -23.3557, lng: -47.8569 };
            const center = data.origem_coords && typeof data.origem_coords === 'object' && 'lat' in data.origem_coords
                ? { lat: data.origem_coords.lat, lng: data.origem_coords.lng }
                : TATUI_CENTER;
            setInitialCenter(center);

            setIsLoading(false);
        };

        if (user) {
            fetchRouteData();
        }
    }, [routeId, user]);

    const handleInputChange = (field: keyof FormData, value: any) => {
        setFormData(prev => prev ? { ...prev, [field]: value } : null);
    };

    const handleAddPonto = (ponto: Ponto) => {
        if (modoEdicaoMapa === 'inicio') setPontoInicio(ponto);
        else if (modoEdicaoMapa === 'fim') setPontoFim(ponto);
        else setPontosDeInteresse(prev => [...prev, ponto]);
    }

    const handleRemovePontoInteresse = (index: number) => {
        setPontosDeInteresse(prev => prev.filter((_, i) => i !== index));
    }

    const handleUpdateRoute = async () => {
        if (!user || !formData) {
            setError("Dados insuficientes para atualizar a rota.");
            return;
        }

        setIsUpdating(true);
        setError(null);

        const { error: updateRotaError } = await supabase
            .from('rotas')
            .update({
                ...formData,
                origem_coords: pontoInicio,
                destino_coords: pontoFim,
            })
            .eq('id', routeId);

        if (updateRotaError) {
            setError(`Erro ao atualizar a rota: ${updateRotaError.message}`);
            setIsUpdating(false);
            return;
        }

        await supabase.from('pontos_interesse').delete().eq('rota_id', routeId);

        if (pontosDeInteresse.length > 0) {
            const pontosParaInserir = pontosDeInteresse.map(ponto => ({
                rota_id: parseInt(routeId),
                nome: ponto.nome || 'Ponto de Interesse',
                coords: { lat: ponto.lat, lng: ponto.lng },
            }));

            const { error: insertPontosError } = await supabase
                .from('pontos_interesse')
                .insert(pontosParaInserir);

            if (insertPontosError) {
                setError(`A rota foi atualizada, mas houve um erro ao guardar os novos pontos de interesse: ${insertPontosError.message}`);
                setIsUpdating(false);
                return;
            }
        }

        alert("Rota atualizada com sucesso!");
        router.push('/publisher/routes');
    };
    
    if (isLoading) {
        return <div className="p-8 text-center">Carregando editor de rotas...</div>;
    }
    if (error) {
        return <div className="p-8 text-center text-red-600">{error}</div>;
    }
    if (!formData) {
        return <div className="p-8 text-center">Não foi possível carregar os dados da rota.</div>;
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b flex-shrink-0">
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Link href="/publisher/routes">
                            <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
                        </Link>
                        <h1 className="text-xl font-semibold truncate">Editar: {formData.nome}</h1>
                    </div>
                </div>
            </header>

            <main className="flex-grow overflow-y-auto p-4 space-y-6">
                <Card>
                    <CardHeader><CardTitle>Informações Gerais</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        {/* ... (o seu formulário permanece igual) ... */}
                        <div className="space-y-2"><Label htmlFor="nome">Nome da Rota *</Label><Input id="nome" value={formData.nome} onChange={(e) => handleInputChange('nome', e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="descricao_curta">Descrição Curta</Label><Input id="descricao_curta" value={formData.descricao_curta} onChange={(e) => handleInputChange('descricao_curta', e.target.value)} /></div>
                        <div className="space-y-2"><Label htmlFor="descricao">Descrição Completa</Label><Textarea id="descricao" value={formData.descricao} onChange={(e) => handleInputChange('descricao', e.target.value)} /></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-2"><Label htmlFor="categoria">Categoria</Label><Select value={formData.categoria} onValueChange={(v) => handleInputChange('categoria', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="historia">História</SelectItem><SelectItem value="natureza">Natureza</SelectItem><SelectItem value="gastronomia">Gastronomia</SelectItem><SelectItem value="aventura">Aventura</SelectItem></SelectContent></Select></div>
                           <div className="space-y-2"><Label htmlFor="dificuldade">Dificuldade</Label><Select value={formData.dificuldade} onValueChange={(v) => handleInputChange('dificuldade', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Fácil">Fácil</SelectItem><SelectItem value="Moderado">Moderado</SelectItem><SelectItem value="Difícil">Difícil</SelectItem></SelectContent></Select></div>
                           <div className="space-y-2"><Label htmlFor="status">Status</Label><Select value={formData.status} onValueChange={(v) => handleInputChange('status', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Ativo">Ativo</SelectItem><SelectItem value="Pausado">Pausado</SelectItem><SelectItem value="Rascunho">Rascunho</SelectItem></SelectContent></Select></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-2"><Label htmlFor="preco">Preço (R$)</Label><Input id="preco" type="number" value={formData.preco} onChange={(e) => handleInputChange('preco', parseFloat(e.target.value) || 0)} /></div>
                           <div className="space-y-2"><Label htmlFor="duracao">Duração</Label><Input id="duracao" value={formData.duracao} onChange={(e) => handleInputChange('duracao', e.target.value)} placeholder="Ex: 2 horas"/></div>
                           <div className="space-y-2"><Label htmlFor="max_participantes">Máx. de Pessoas</Label><Input id="max_participantes" type="number" value={formData.max_participantes} onChange={(e) => handleInputChange('max_participantes', parseInt(e.target.value) || 0)} /></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg flex items-center"><Map className="w-5 h-5 mr-2" /> Editor de Rota no Mapa</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            <Button variant={modoEdicaoMapa === 'inicio' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('inicio')}><Play className="w-4 h-4 mr-2" /> Definir Início</Button>
                            <Button variant={modoEdicaoMapa === 'fim' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('fim')}><Flag className="w-4 h-4 mr-2" /> Definir Fim</Button>
                            <Button variant={modoEdicaoMapa === 'interesse' ? 'default' : 'outline'} onClick={() => setModoEdicaoMapa('interesse')}><Pin className="w-4 h-4 mr-2" /> Adicionar Ponto</Button>
                        </div>
                        <div className="w-full h-[400px] rounded-md overflow-hidden border">
                            {initialCenter && (
                                <MapEditor
                                    initialCenter={initialCenter}
                                    pontoInicio={pontoInicio}
                                    pontoFim={pontoFim}
                                    pontosInteresse={pontosDeInteresse}
                                    onAddPonto={handleAddPonto}
                                />
                            )}
                        </div>
                        <div className="space-y-2">
                            {/* --- INÍCIO DA CORREÇÃO DE DESIGN --- */}
                            {pontoInicio && (
                                <div className="flex items-center justify-between p-2 bg-green-50 rounded-md text-sm">
                                    <div className="flex items-center gap-2 min-w-0"> {/* Adicionado min-w-0 */}
                                        <Play className="h-4 w-4 text-green-700 flex-shrink-0" />
                                        <span className="font-medium text-green-800 truncate">
                                            {/* Mostra o nome se existir, senão um texto padrão */}
                                            {pontoInicio.nome || 'Ponto de Início definido'}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setPontoInicio(null)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            )}
                            {pontoFim && (
                                <div className="flex items-center justify-between p-2 bg-red-50 rounded-md text-sm">
                                    <div className="flex items-center gap-2 min-w-0"> {/* Adicionado min-w-0 */}
                                        <Flag className="h-4 w-4 text-red-700 flex-shrink-0" />
                                        <span className="font-medium text-red-800 truncate">
                                            {/* Mostra o nome se existir, senão um texto padrão */}
                                            {pontoFim.nome || 'Ponto Final definido'}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => setPontoFim(null)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            )}
                            {pontosDeInteresse.map((ponto, index) => (
                                <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-md text-sm">
                                    <div className="flex items-center gap-2 min-w-0"> {/* Adicionado min-w-0 */}
                                        <Pin className="h-4 w-4 text-gray-600 flex-shrink-0" />
                                        <span className="truncate">{ponto.nome || `Ponto #${index + 1}`}</span>
                                    </div>
                                    <Button variant="ghost" size="sm" onClick={() => handleRemovePontoInteresse(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                                </div>
                            ))}
                            {/* --- FIM DA CORREÇÃO DE DESIGN --- */}
                        </div>
                    </CardContent>
                </Card>
                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            </main>

            <footer className="bg-white border-t p-4 flex-shrink-0">
                <div className="flex justify-end space-x-3">
                    <Button variant="outline" disabled={isUpdating} onClick={() => router.back()}>Cancelar</Button>
                    <Button onClick={handleUpdateRoute} disabled={isUpdating}>
                        {isUpdating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Atualizando...</> : <><Save className="w-4 h-4 mr-2" /> Atualizar Rota</>}
                    </Button>
                </div>
            </footer>
        </div>
    )
}