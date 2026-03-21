import { createClient } from "@supabase/supabase-js"
import { UserForm } from "@/components/user-form"
import { notFound } from "next/navigation"

export default async function EditarUsuarioPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single()

  if (!profile) notFound()

  const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Editar Usuario
        </h1>
        <p className="text-muted-foreground">
          Modifica los datos del usuario
        </p>
      </div>

      <UserForm
        profile={{ ...profile, email: user?.email }}
        isEdit
      />
    </div>
  )
}