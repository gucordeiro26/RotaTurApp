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
        { title: "Total de Rotas", value: "0", icon: Map, color: "from-blue-500 to-blue-700", href: "/publisher/routes" },
        { title: "Publicadas", value: "0", icon: CheckCircle, color: "from-green-500 to-green-700", href: "/publisher/routes" },
        { title: "Rascunhos", value: "0", icon: FileText, color: "from-orange-500 to-amber-600", href: "/publisher/routes" },
    ])

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return

            setIsLoading(true)

            const { data: rotasData, error } = await supabase
                .from("rotas")
                .select("id, nome, status, criado_em")
                .eq("publicador_id", user.id)
                .order("criado_em", { ascending: false })

            if (!error && rotasData) {
                const rotas = rotasData as Rota[]

                setRotas(rotas)

                setStats([
                    { title: "Total de Rotas", value: rotas.length.toString(), icon: Map, color: "from-blue-500 to-blue-700", href: "/publisher/routes" },
                    { title: "Publicadas", value: rotas.filter(r => r.status === "Ativo").length.toString(), icon: CheckCircle, color: "from-green-500 to-green-700", href: "/publisher/routes" },
                    { title: "Rascunhos", value: rotas.filter(r => r.status === "Rascunho").length.toString(), icon: FileText, color: "from-orange-500 to-amber-600", href: "/publisher/routes" },
                ])
            }

            setIsLoading(false)
        }

        fetchData()
    }, [user?.id])

    if (isLoading) {
        return (
            <div className="p-4 sm:p-8 space-y-4">
                <Skeleton className="h-12 w-48 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Skeleton className="h-24" /><Skeleton className="h-24" /><Skeleton className="h-24" />
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pb-32">

            {/* HEADER MODERNO */}
            <header className="bg-white/80 backdrop-blur-md border-b shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4 max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-md">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-xl text-gray-800 tracking-tight">
                            Painel do Publicador
                        </h1>
                    </div>

                    <Link href="/publisher/routes/create">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 shadow-md">
                            <Plus className="w-4 h-4 mr-2" /> Nova Rota
                        </Button>
                    </Link>
                </div>
            </header>

            {/* CONTEÚDO */}
            <div className="p-4 max-w-7xl mx-auto space-y-8">

                {/* CARDS DE ESTATÍSTICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {stats.map((stat, index) => (
                        <Link href={stat.href} key={index}>
                            <Card className="shadow-sm border-0 hover:shadow-lg transition-all rounded-xl cursor-pointer bg-white overflow-hidden group">
                                <CardContent className="p-5 flex items-center gap-4">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                                        <stat.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-3xl font-extrabold text-gray-900 group-hover:text-blue-700 transition-colors">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* LISTA DE ROTAS */}
                <Card className="border-none shadow-sm rounded-xl">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Rotas Recentes</CardTitle>
                                <CardDescription>Suas últimas rotas criadas</CardDescription>
                            </div>
                            <Link href="/publisher/routes">
                                <Button variant="outline" size="sm" className="hidden sm:flex">Ver Todas</Button>
                            </Link>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {rotas.length > 0 ? (
                            <div className="divide-y border-t rounded-b-xl">
                                {rotas.slice(0, 6).map((rota) => (
                                    <div key={rota.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-4 hover:bg-gray-50 transition-all gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 truncate">{rota.nome}</h4>
                                            <p className="text-xs text-gray-500">
                                                Criado em {new Date(rota.criado_em).toLocaleDateString("pt-BR")}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Badge variant={rota.status === "Ativo" ? "default" : "secondary"} className="capitalize px-3 py-1 shadow-sm">
                                                {rota.status}
                                            </Badge>

                                            <Link href={`/publisher/routes/edit/${rota.id}`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600">
                                                    <ArrowUpRight className="w-5 h-5" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-gray-500">
                                <Map className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                <p>Nenhuma rota criada ainda.</p>
                                <Link href="/publisher/routes/create">
                                    <Button variant="link" className="mt-2">Criar agora</Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}