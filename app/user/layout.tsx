"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, type Profile } from "@/app/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import {
    Sidebar,
    SidebarProvider,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Map, Home, Star, UserCircle } from "lucide-react";

function FullScreenLoader() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="text-center">
                <p className="text-lg font-semibold">A carregar...</p>
                <p className="text-sm text-muted-foreground">A verificar a sua sessão.</p>
            </div>
        </div>
    );
}

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!isLoading && !hasCheckedAuth) {
            if (!user || profile?.tipo_perfil !== 'usuario') {
                router.replace('/');
            }
            setHasCheckedAuth(true);
        }
    }, [user, profile, isLoading, hasCheckedAuth, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (user && profile && profile.tipo_perfil === 'usuario') {
        return (
            <SidebarProvider>
                <div className="flex h-screen">
                    <Sidebar userProfile={profile as Profile}>
                        <SidebarHeader>
                            <div className="flex items-center gap-2 p-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile.url_avatar || undefined} />
                                    <AvatarFallback>{profile.nome_completo?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-0.5 text-sm">
                                    <div className="font-semibold">{profile.nome_completo}</div>
                                    <div className="text-muted-foreground capitalize">{profile.tipo_perfil}</div>
                                </div>
                            </div>
                        </SidebarHeader>
                        <SidebarContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <Link href="/user/dashboard" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><Home /><span>Início</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/routes" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><Map /><span>Explorar Rotas</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/favorites" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><Star /><span>Favoritos</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/profile" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><UserCircle /><span>Meu Perfil</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                        <SidebarFooter>
                             <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton onClick={handleLogout}>
                                        <LogOut /><span>Sair</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarFooter>
                    </Sidebar>
                    <main className="flex-1 overflow-y-auto bg-muted/40">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    return null;
}