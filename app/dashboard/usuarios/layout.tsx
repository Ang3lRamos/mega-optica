import { redirect } from "next/navigation"
import { getAdminUser } from "@/lib/supabase/admin"

// Todas las páginas de /dashboard/usuarios usan la service role key: solo administradores
export default async function UsuariosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = await getAdminUser()
  if (!user) redirect("/dashboard")

  return children
}
