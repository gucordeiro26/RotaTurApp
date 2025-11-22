"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useUser } from "@/app/contexts/UserContext"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Map, Heart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

export default function UserDashboard() {
    const { user } = useUser()
    const [favoritosCount, setFavoritosCount] = useState(0)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return;
            setIsLoading(true);

            const { count } = await supabase
                .from('favoritos')
                .select('*', { count: 'exact', head: true })
                .eq('usuario_id', user.id);

            setFavoritosCount(count || 0);
            setIsLoading(false);
        }
        if (user?.id) fetchData();
    }, [user?.id]);

    if (isLoading) return <div className="p-8"><Skeleton className="h-32 w-full" /></div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">Olá, {user?.email?.split('@')[0]}!</h1>
                <p className="text-gray-500">Pronto para explorar novas rotas hoje?</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Card de Explorar */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-700">
                            <Map className="h-5 w-5" /> Explorar Rotas
                        </CardTitle>
                        <CardDescription className="text-blue-600/80">
                            Descubra novos destinos e experiências na região.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/user/routes">
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Ver Rotas Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Card de Favoritos */}
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-100">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-rose-700">
                            <Heart className="h-5 w-5" /> Meus Favoritos
                        </CardTitle>
                        <CardDescription className="text-rose-600/80">
                            Você tem <strong>{favoritosCount}</strong> rotas salvas na sua lista.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/user/favorites">
                            <Button variant="outline" className="w-full border-rose-200 text-rose-700 hover:bg-rose-100 hover:text-rose-800">
                                Aceder aos Favoritos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}