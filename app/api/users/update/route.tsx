import { NextResponse } from "next/server"
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { user: admin, status } = await getAdminUser()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status })

    const supabaseAdmin = createAdminClient()

    const { id, email, password, full_name, role } = await request.json()

    // Evita que un administrador se quite su propio rol y se quede sin acceso
    if (id === admin.id && role !== "administrador") {
      return NextResponse.json({ error: "No puedes cambiar tu propio rol" }, { status: 400 })
    }

    // Actualizar en auth.users
    const authUpdate: Record<string, unknown> = {
      email,
      user_metadata: { full_name },
      app_metadata: { role },
    }
    if (password) authUpdate.password = password

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(id, authUpdate)
    if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

    // Actualizar en profiles
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ full_name, role })
      .eq("id", id)

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
