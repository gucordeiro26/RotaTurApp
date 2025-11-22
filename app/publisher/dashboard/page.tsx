"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Map } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Rota = {
    id: number;
    nome: string;
};

export default function PublisherDashboard() {
    const { user } = useUser()
    const [rotas, setRotas] = useState<Rota[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            setIsLoading(true);

            const { data: rotasData, error: rotasError } = await supabase
                .from('rotas')
                .select('id, nome')
                .eq('publicador_id', user.id)
                .order('created_at', { ascending: false }); // ou 'criado_em'

            if (rotasError) {
                console.error("Erro ao buscar rotas:", rotasError);
            } else {
                setRotas(rotasData || []);
            }
            setIsLoading(false);
        }

        if (user?.id) fetchData();
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="p-4 sm:p-6 lg:p-8">
                <Skeleton className="h-8 w-48 mb-6" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
                </div>
                <Card><CardHeader><Skeleton className="h-6 w-1/2" /></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <Link href="/publisher/routes/create">
                    <Button>Criar Nova Rota</Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Rotas</CardTitle>
                        <Map className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{rotas.length}</div>
                        <p className="text-xs text-muted-foreground">Suas rotas ativas e rascunhos.</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Rotas Recentes</CardTitle>
                        <CardDescription>As suas rotas criadas mais recentemente.</CardDescription>
                    </div>
                     <Link href="/publisher/routes">
                        <Button variant="outline" size="sm">Ver Todas</Button>
                    </Link>
                </CardHeader>
                <CardContent>
                     <div className="space-y-4">
                        {rotas.length > 0 ? (
                            rotas.slice(0, 5).map((rota) => (
                                <div key={rota.id} className="flex items-center justify-between">
                                    <span className="font-medium">{rota.nome}</span>
                                    <Link href={`/publisher/routes/edit/${rota.id}`}>
                                        <Button variant="ghost" size="sm">
                                            Editar <ArrowUpRight className="h-4 w-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-center text-muted-foreground">Nenhuma rota encontrada.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}