import { NextResponse } from "next/server"
import { createAdminClient, getAdminUser } from "@/lib/supabase/admin"

export async function POST(request: Request) {
  try {
    const { user: admin, status } = await getAdminUser()
    if (!admin) return NextResponse.json({ error: "No autorizado" }, { status })

    const supabaseAdmin = createAdminClient()

    const { id } = await request.json()

    // Verificar que no sea admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", id)
      .single()

    if (profile?.role === "administrador") {
      return NextResponse.json({ error: "No se puede eliminar un administrador" }, { status: 403 })
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 })
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Error interno:", err)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}