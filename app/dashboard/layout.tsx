import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Separator } from "@/components/ui/separator"
import { Profile } from "@/lib/types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }
  
  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()
  
  // Si no existe el profile, créalo con rol por defecto
  if (!profile) {
    const { data: newProfile } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        full_name: user.email?.split("@")[0] || "Usuario",
        role: "recepcionista"
      })
      .select()
      .single()
    
    profile = newProfile
  }
  
  // Si aún no hay profile, mostrar error en lugar de redirect loop
  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-destructive">Error al cargar el perfil de usuario</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <AppSidebar profile={profile as Profile} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1" />
          <ThemeToggle />
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
