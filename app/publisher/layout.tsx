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
import { LogOut, Map, BarChart3, MessageSquare } from "lucide-react";

function FullScreenLoader() {
    return (
        <div className="flex items-center justify-center h-screen bg-background">
            <div className="text-center">
                <p className="text-lg font-semibold">A carregar...</p>
                <p className="text-sm text-muted-foreground">A verificar as suas credenciais.</p>
            </div>
        </div>
    );
}

export default function PublisherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        if (!isLoading && !hasCheckedAuth) {
            const isAllowed = profile?.tipo_perfil === 'publicador' || profile?.tipo_perfil === 'admin';
            if (!user || !isAllowed) {
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

    const isAllowed = user && profile && (profile.tipo_perfil === 'publicador' || profile.tipo_perfil === 'admin');
    if (isAllowed) {
        return (
            <SidebarProvider>
                <div className="flex h-screen">
                    <Sidebar userProfile={profile as Profile}>
                        <SidebarHeader>
                            <div className="flex items-center gap-2 p-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={profile.url_avatar || undefined} />
                                    <AvatarFallback>{profile.nome_completo?.charAt(0).toUpperCase() || 'P'}</AvatarFallback>
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
                                    <Link href="/publisher/dashboard" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><BarChart3 /><span>Dashboard</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/publisher/routes" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><Map /><span>Minhas Rotas</span></a>
                                        </SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                     <Link href="/publisher/messages" passHref legacyBehavior>
                                        <SidebarMenuButton asChild>
                                            <a><MessageSquare /><span>Mensagens</span></a>
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