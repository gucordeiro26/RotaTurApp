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
import { ArrowLeft, Clock, Edit, AlertCircle, HardHat, MapPin } from 'lucide-react'
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
    imagem_url: string | null; // Adicionado
    perfis: {
        nome_completo: string | null;
    } | null;
}

export default function RouteDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { user, profile } = useUser();
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
                setRoute(data as any);
            }
            setIsLoading(false);
        };

        fetchRouteDetails();
    }, [routeId]);

    const handleOpenInMaps = () => {
        if (!route || !route.origem_coords) return;

        const origin = `${route.origem_coords.lat},${route.origem_coords.lng}`;
        
        let destination = "";
        if (route.destino_coords) {
            destination = `&destination=${route.destino_coords.lat},${route.destino_coords.lng}`;
        } else {
            destination = `&destination=${origin}`; 
        }

        let waypoints = "";
        if (route.pontos_interesse && route.pontos_interesse.length > 0) {
            const points = route.pontos_interesse.map(p => `${p.lat},${p.lng}`).join('|');
            waypoints = `&waypoints=${points}`;
        }

        const mapUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}${destination}${waypoints}&travelmode=driving`;
        window.open(mapUrl, '_blank');
    };

    const renderActionButton = () => {
        if (!route) return null;

        // Se o usuário é publicador E é o autor da rota, mostra opção de editar
        if (profile?.tipo_perfil === 'publicador' && user && user.id === route.publicador_id) {
            return (
                <Link href={`/publisher/routes/edit/${route.id}`} passHref>
                    <Button className="w-full" size="lg">
                        <Edit className="mr-2 h-4 w-4" /> Editar Minha Rota
                    </Button>
                </Link>
            );
        }

        // Caso contrário (ou se for admin), mostra opção de abrir no mapa
        return (
            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg" onClick={handleOpenInMaps}>
                <MapPin className="mr-2 h-4 w-4" /> Abrir no Google Maps
            </Button>
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

            {/* --- IMAGEM DA ROTA (BANNER) --- */}
            {route.imagem_url && (
                <div className="w-full h-64 md:h-80 overflow-hidden relative">
                    <img src={route.imagem_url} alt={route.nome} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
            )}

            <div className="p-4 space-y-6 pb-24 -mt-4 relative z-0"> 
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

                {/* Mapa */}
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

            <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t z-20">
                <div className="max-w-4xl mx-auto">
                    {renderActionButton()}
                </div>
            </div>
        </div>
    );
}