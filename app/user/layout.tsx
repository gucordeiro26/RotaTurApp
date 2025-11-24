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
import { LogOut, Map, Home, Star, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/');
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    // Links para a Bottom Nav
    const mobileLinks = [
        { href: "/user/dashboard", label: "Início", icon: Home },
        { href: "/user/routes", label: "Explorar", icon: Map },
        { href: "/user/favorites", label: "Favoritos", icon: Star },
        { href: "/user/profile", label: "Perfil", icon: UserCircle },
    ];

    if (isLoading) return <FullScreenLoader />;

    if (user && profile) {
        return (
            <SidebarProvider>
                <div className="flex h-screen w-full">
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
                                        <SidebarMenuButton asChild><a><Home /><span>Início</span></a></SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/routes" passHref legacyBehavior>
                                        <SidebarMenuButton asChild><a><Map /><span>Explorar Rotas</span></a></SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/favorites" passHref legacyBehavior>
                                        <SidebarMenuButton asChild><a><Star /><span>Favoritos</span></a></SidebarMenuButton>
                                    </Link>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <Link href="/user/profile" passHref legacyBehavior>
                                        <SidebarMenuButton asChild><a><UserCircle /><span>Meu Perfil</span></a></SidebarMenuButton>
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

                    <main className="flex-1 overflow-y-auto bg-muted/40 pb-20 md:pb-0">
                        {children}
                    </main>

                    {/* --- BOTTOM NAVIGATION (MOBILE) --- */}
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