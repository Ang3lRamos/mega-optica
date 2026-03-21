import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    const { id, email, password, full_name, role } = await request.json()

    // Actualizar en auth.users
    const authUpdate: Record<string, unknown> = {
      email,
      user_metadata: { full_name, role },
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