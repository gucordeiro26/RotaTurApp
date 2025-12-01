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
    const [firstName, setFirstName] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [fadeIn, setFadeIn] = useState(false)

    useEffect(() => {
        setFadeIn(true)
    }, [])

    useEffect(() => {
        const fetchData = async () => {
            if (!user?.id) return
            setIsLoading(true)

            // Buscar favoritos
            const { count } = await supabase
                .from("favoritos")
                .select("*", { count: "exact", head: true })
                .eq("usuario_id", user.id)

            setFavoritosCount(count || 0)

            // Buscar nome completo do usuário
            const { data: profile } = await supabase
                .from("perfis")
                .select("nome_completo")
                .eq("id", user.id)
                .single()

            let extractedName = null

            if (profile?.nome_completo) {
                extractedName = profile.nome_completo.split(" ")[0]
            } else if (user?.email) {
                extractedName = user.email.split("@")[0]
            }

            setFirstName(extractedName)
            setIsLoading(false)
        }

        if (user?.id) fetchData()
    }, [user?.id])


    if (isLoading) {
        return (
            <div className="p-8 space-y-6">
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        )
    }

    return (
        <div
            className={`p-4 sm:p-6 lg:p-8 space-y-8 transition-all duration-500 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
        >
            {/* Header */}
            <div className="space-y-1">
                <h1 className="text-3xl font-bold text-gray-900">
                    Olá, {firstName}!
                </h1>
                <p className="text-gray-600">
                    Pronto para descobrir novas experiências hoje?
                </p>
            </div>

            {/* Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Card Explorar */}
                <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-blue-100 to-blue-200 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-blue-800">
                            <Map className="h-5 w-5" /> Explorar Rotas
                        </CardTitle>
                        <CardDescription className="text-blue-700/80">
                            Descubra destinos e experiências perto de você.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/user/routes">
                            <Button className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center">
                                Ver Rotas Disponíveis
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Card Favoritos */}
                <Card className="rounded-2xl shadow-sm bg-gradient-to-br from-rose-100 to-pink-200 border-rose-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-rose-800">
                            <Heart className="h-5 w-5" /> Meus Favoritos
                        </CardTitle>
                        <CardDescription className="text-rose-700/80">
                            Você possui <strong>{favoritosCount}</strong> rotas salvas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link href="/user/favorites">
                            <Button
                                variant="outline"
                                className="w-full h-11 rounded-xl border-rose-400 text-rose-700 hover:bg-rose-100"
                            >
                                Ver seus Favoritos
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
