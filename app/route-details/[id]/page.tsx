"use client"

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { supabase } from '@/lib/supabase'
import { useUser } from '@/app/contexts/UserContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Clock, Edit, HardHat, MapPin } from 'lucide-react'
import Link from 'next/link'
import type { Ponto } from '@/components/OverviewMap'

type RotaCompleta = {
    id: number;
    nome: string;
    descricao: string;
    dificuldade: string;
    duracao: string;
    publicador_id: string;
    origem_coords: Ponto | null;
    destino_coords: Ponto | null;
    pontos_interesse: Ponto[];
    imagem_url: string | null;
    perfis: {
        nome_completo: string | null;
    } | null;
}

export default function RouteDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useUser();
    const routeId = params.id as string;

    const [route, setRoute] = useState<RotaCompleta | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const RouteViewerMap = useMemo(() => dynamic(
        () => import('@/components/OverviewMap'),
        {
            loading: () => <Skeleton className="h-full w-full" />,
            ssr: false,
        }
    ), []);

    useEffect(() => {
        const fetchRouteDetails = async () => {
            if (!routeId) return;

            setIsLoading(true);
            const { data, error } = await supabase
                .from('rotas')
                .select(`
                    *,
                    pontos_interesse(*),
                    perfis ( nome_completo )
                `)
                .eq('id', routeId)
                .single();

            if (error || !data) {
                console.error("Erro ao buscar detalhes da rota:", error);
                setError("Não foi possível encontrar esta rota.");
            } else {
                // --- CORREÇÃO CRÍTICA AQUI ---
                // O Supabase retorna os pontos de interesse com as coordenadas dentro de um objeto 'coords' (JSON).
                // Precisamos extrair 'lat' e 'lng' para a raiz do objeto para que o Mapa e o Link funcionem.

                const pontosFormatados = (data.pontos_interesse || []).map((p: any) => {
                    // Tenta pegar de coords (se existir) ou da raiz
                    const lat = p.coords?.lat ?? p.lat;
                    const lng = p.coords?.lng ?? p.lng;
                    return {
                        lat: lat,
                        lng: lng,
                        nome: p.nome
                    };
                }).filter((p: any) => p.lat !== undefined && p.lng !== undefined); // Filtra pontos inválidos

                // Atualiza o objeto rota com os pontos corrigidos
                setRoute({
                    ...data,
                    pontos_interesse: pontosFormatados
                } as any);
            }
            setIsLoading(false);
        };

        fetchRouteDetails();
    }, [routeId]);

    const handleOpenInMaps = () => {
        if (!route || !route.origem_coords) return;

        const origin = `${route.origem_coords.lat},${route.origem_coords.lng}`;

        // Se não houver destino, usa a origem (volta ao início)
        let destination = origin;
        if (route.destino_coords) {
            destination = `${route.destino_coords.lat},${route.destino_coords.lng}`;
        }

        // --- URL UNIVERSAL DO GOOGLE MAPS ---
        // Esta estrutura é a mais robusta para Navegação com Waypoints
        let mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;

        if (route.pontos_interesse && route.pontos_interesse.length > 0) {
            const points = route.pontos_interesse
                .map(p => `${p.lat},${p.lng}`)
                .join('|'); // O Google Maps usa pipe '|' para separar waypoints

            if (points.length > 0) {
                mapUrl += `&waypoints=${points}`;
            }
        }

        window.open(mapUrl, '_blank');
    };

    const renderFooterActions = () => {
        if (!route) return null;

        const isOwner = user && user.id === route.publicador_id;

        return (
            <div className="flex flex-col gap-3 w-full">
                {/* Botão Principal: Maps (Sempre visível) */}
                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg h-12 text-base"
                    onClick={handleOpenInMaps}
                >
                    <MapPin className="mr-2 h-5 w-5" /> Abrir no Google Maps
                </Button>

                {/* Botão Secundário: Editar (Apenas para o dono) */}
                {isOwner && (
                    <Link href={`/publisher/routes/edit/${route.id}`} passHref className="w-full">
                        <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50" size="lg">
                            <Edit className="mr-2 h-4 w-4" /> Editar Minha Rota
                        </Button>
                    </Link>
                )}
            </div>
        );
    }

    if (isLoading) return <div className="p-8 text-center">A carregar detalhes...</div>;
    if (error || !route) return <div className="p-8 text-center text-red-600">{error}</div>;

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Fácil": return "bg-green-100 text-green-800";
            case "Moderado": return "bg-yellow-100 text-yellow-800";
            case "Difícil": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    }

    return (
        <div className="min-h-screen bg-muted/40">
            <div className="sticky top-0 bg-background/80 backdrop-blur-sm border-b p-2 flex items-center gap-2 z-10">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold truncate">{route.nome}</h1>
            </div>

            {route.imagem_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden relative">
                    <img src={route.imagem_url} alt={route.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
            )}

            <div className="p-4 space-y-6 pb-32 -mt-4 relative z-0">
                <Card className="shadow-lg border-0">
                    <CardHeader>
                        <CardTitle className="text-3xl">{route.nome}</CardTitle>
                        <CardDescription>
                            Criada por <span className="font-medium text-primary">{route.perfis?.nome_completo}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3 mb-6">
                            <Badge variant="outline" className="px-3 py-1 flex items-center gap-2 text-sm">
                                <Clock className="h-4 w-4" /> {route.duracao || 'N/A'}
                            </Badge>
                            <Badge variant="secondary" className={`px-3 py-1 text-sm ${getDifficultyColor(route.dificuldade)}`}>
                                <HardHat className="h-4 w-4 mr-2" /> {route.dificuldade}
                            </Badge>
                        </div>
                        <div className="prose prose-slate max-w-none text-foreground/80">
                            <p className="whitespace-pre-wrap leading-relaxed">{route.descricao}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle className="text-lg">Itinerário</CardTitle></CardHeader>
                    <CardContent className="p-0 overflow-hidden h-80 rounded-b-lg">
                        <RouteViewerMap
                            pontoInicio={route.origem_coords}
                            pontoFim={route.destino_coords}
                            pontosInteresse={route.pontos_interesse}
                        />
                    </CardContent>
                </Card>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-md border-t z-20 pb-6 sm:pb-4">
                <div className="max-w-4xl mx-auto">
                    {renderFooterActions()}
                </div>
            </div>
        </div>
    );
}