import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

/**
 * Cliente con la service role key: se salta RLS.
 * Solo usar en el servidor y DESPUÉS de verificar que quien llama es administrador.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/**
 * Devuelve el usuario en sesión si es administrador.
 * Si no hay sesión devuelve { status: 401 }, si no es admin { status: 403 }.
 */
export async function getAdminUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { user: null, status: 401 as const }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "administrador") return { user: null, status: 403 as const }

  return { user, status: 200 as const }
}
