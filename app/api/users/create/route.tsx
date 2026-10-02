import { NextResponse } from "next/server"
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { user: admin, status } = await getAdminUser()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status })

    const supabaseAdmin = createAdminClient()

    const { email, password, full_name, role } = await request.json()

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
      // El rol va en app_metadata: el usuario no puede modificarlo y es el que lee el trigger
      app_metadata: { role },
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })

    // El trigger crea el perfil; se asegura el rol y nombre por si el trigger usa otro valor
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .upsert({ id: data.user.id, full_name, role })

    if (profileError) return NextResponse.json({ error: profileError.message }, { status: 400 })

    return NextResponse.json({ user: data.user })
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
