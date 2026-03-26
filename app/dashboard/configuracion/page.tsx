import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile-form"

export default async function ConfiguracionPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Gestiona tu perfil y datos profesionales
        </p>
      </div>

      <ProfileForm profile={profile} userEmail={user?.email || ""} />
    </div>
  )
}