"use client"

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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
import { LogOut, Map, BarChart3, UserCircle, PlusCircle } from "lucide-react"; // Importando ícones corretos
import { cn } from "@/lib/utils";

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
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            const isAllowed = profile?.tipo_perfil === 'publicador' || profile?.tipo_perfil === 'admin';
            if (!user || !isAllowed) {
                router.push('/');
            }
        }
    }, [user, profile, isLoading, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // --- MUDANÇA: Menu Inferior Focado no Publicador ---
    const mobileLinks = [
        { href: "/publisher/dashboard", label: "Painel", icon: BarChart3 },
        { href: "/publisher/routes", label: "Minhas Rotas", icon: Map },
        { href: "/publisher/routes/create", label: "Criar", icon: PlusCircle },
        { href: "/user/profile", label: "Perfil", icon: UserCircle },
    ];

    if (isLoading) {
        return <FullScreenLoader />;
    }

    const isAllowed = user && profile && (profile.tipo_perfil === 'publicador' || profile.tipo_perfil === 'admin');

    if (isAllowed) {
        return (
            <SidebarProvider>
                <div className="flex min-h-screen w-full bg-muted/40">
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

                    <main className="flex-1 flex flex-col pb-20 md:pb-0">
                        {children}
                    </main>

                    {/* --- BOTTOM NAVIGATION DO PUBLICADOR --- */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
                        <div className="flex justify-around items-center h-16">
                            {mobileLinks.map((link) => {
                                const isActive = pathname === link.href;
                                return (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        className={cn(
                                            "flex flex-col items-center justify-center w-full h-full space-y-1",
                                            isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
                                        )}
                                    >
                                        <link.icon className={cn("w-6 h-6", isActive && "fill-current")} />
                                        <span className="text-[10px] font-medium">{link.label}</span>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </SidebarProvider>
        );
    }

    return null;
}