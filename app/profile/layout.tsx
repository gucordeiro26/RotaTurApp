"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser, type Profile } from "@/app/contexts/UserContext";
import { supabase } from "@/lib/supabase";
import {
    Sidebar,
    SidebarProvider,
} from "@/components/ui/sidebar";

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

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, profile, isLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            // Se não há sessão, redireciona
            if (!user) {
                router.replace('/');
            }
        }
    }, [user, isLoading, router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    if (isLoading) {
        return <FullScreenLoader />;
    }

    if (user && profile) {
        // Com hierarquia, todos os perfis têm acesso às funcionalidades de turista
        // usuario, publicador e admin podem acessar o perfil
        return (
            <SidebarProvider>
                <div className="flex h-screen">
                    <Sidebar userProfile={profile as Profile} />
                    <main className="flex-1 overflow-y-auto bg-muted/40">
                        {children}
                    </main>
                </div>
            </SidebarProvider>
        );
    }

    return null;
}
