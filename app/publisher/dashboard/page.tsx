"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Map, FileText, CheckCircle, LayoutDashboard, Plus } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

type Rota = {
    id: number;
    nome: string;
    status: string;
    criado_em: string;
};

export default function PublisherDashboard() {
    const { user } = useUser()
    const [rotas, setRotas] = useState<Rota[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState([
        { title: "Total de Rotas", value: "0", icon: Map, color: "bg-blue-500", href: "/publisher/routes" },
        { title: "Publicadas", value: "0", icon: CheckCircle, color: "bg-green-500", href: "/publisher/routes" },
        { title: "Rascunhos", value: "0", icon: FileText, color: "bg-orange-500", href: "/publisher/routes" },
    ])

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;

            setIsLoading(true);

            const { data: rotasData, error: rotasError } = await supabase
                .from('rotas')
                .select('id, nome, status, criado_em')
                .eq('publicador_id', user.id)
                .order('criado_em', { ascending: false });

            if (rotasError) {
                console.error("Erro ao buscar rotas:", rotasError);
            } else {
                const rotas = rotasData as Rota[] || [];
                setRotas(rotas);

                const total = rotas.length;
                const ativas = rotas.filter(r => r.status === 'Ativo').length;
                const rascunhos = rotas.filter(r => r.status === 'Rascunho').length;

                setStats([
                    { title: "Total de Rotas", value: String(total), icon: Map, color: "bg-blue-500", href: "/publisher/routes" },
                    { title: "Publicadas", value: String(ativas), icon: CheckCircle, color: "bg-green-500", href: "/publisher/routes" },
                    { title: "Rascunhos", value: String(rascunhos), icon: FileText, color: "bg-orange-500", href: "/publisher/routes" },
                ]);
            }
            setIsLoading(false);
        }

        if (user?.id) {
            fetchData();
        }
    }, [user?.id]);

    if (isLoading) {
        return (
            <div className="p-4 sm:p-8 space-y-4">
                <Skeleton className="h-12 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* CORREÇÃO: Header fixo e responsivo */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="px-4 py-4 flex items-center justify-between max-w-7xl mx-auto w-full">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-lg font-bold text-gray-900">Painel do Publicador</h1>
                    </div>
                    <Link href="/publisher/routes/create">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="w-4 h-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline">Nova Rota</span>
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="p-4 space-y-6 w-full max-w-7xl mx-auto pb-24">

                {/* CORREÇÃO: Grid 1 coluna no mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <Link href={stat.href} key={index} className="block">
                            <Card className="border-none shadow-sm hover:shadow-md transition-all cursor-pointer hover:bg-gray-50/50 group">
                                <CardContent className="p-5 flex items-center space-x-4">
                                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                        <stat.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{stat.value}</p>
                                        <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card className="border-none shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Rotas Recentes</CardTitle>
                                <CardDescription>As suas últimas criações</CardDescription>
                            </div>
                            <Link href="/publisher/routes">
                                <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-0 p-0 sm:p-6">
                        {rotas.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {rotas.slice(0, 5).map((rota) => (
                                    <div key={rota.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 hover:bg-gray-50/50 transition-colors gap-3">
                                        <div className="flex-1 min-w-0 w-full">
                                            <h4 className="font-semibold text-gray-900 truncate">{rota.nome}</h4>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Criado em {new Date(rota.criado_em).toLocaleDateString('pt-BR')}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                                            <Badge variant={rota.status === "Ativo" ? "default" : "secondary"} className="capitalize px-3 py-1">
                                                {rota.status}
                                            </Badge>
                                            <Link href={`/publisher/routes/edit/${rota.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                                    <ArrowUpRight className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Map className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p>Você ainda não criou nenhuma rota.</p>
                                <Link href="/publisher/routes/create">
                                    <Button variant="link" className="mt-2">Começar agora</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}