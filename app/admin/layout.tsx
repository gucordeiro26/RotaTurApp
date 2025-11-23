"use client"

import { useEffect } from "react";
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
import { LogOut, Map, BarChart3, Users } from "lucide-react";

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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user || profile?.tipo_perfil !== 'admin') {
        router.push('/');
      }
    }
  }, [user, profile, isLoading, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (user && profile?.tipo_perfil === 'admin') {
    return (
      <SidebarProvider>
        {/* --- MUDANÇA AQUI: min-h-screen em vez de h-screen --- */}
        <div className="flex min-h-screen w-full bg-muted/40">
          <Sidebar userProfile={profile as Profile}>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profile.url_avatar || undefined} />
                  <AvatarFallback>{profile.nome_completo?.charAt(0).toUpperCase() || 'A'}</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 text-sm">
                  <div className="font-semibold">{profile.nome_completo}</div>
                  <div className="text-muted-foreground capitalize">Administrador</div>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <Link href="/admin/dashboard" passHref legacyBehavior>
                    <SidebarMenuButton asChild>
                      <a><BarChart3 /><span>Painel</span></a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/routes" passHref legacyBehavior>
                    <SidebarMenuButton asChild>
                      <a><Map /><span>Gerir Rotas</span></a>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <Link href="/admin/users" passHref legacyBehavior>
                    <SidebarMenuButton asChild>
                      <a><Users /><span>Gerir Utilizadores</span></a>
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

          {/* --- MUDANÇA AQUI: Removemos o overflow-y-auto fixo --- */}
          <main className="flex-1 flex flex-col">
            {children}
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return null;
}