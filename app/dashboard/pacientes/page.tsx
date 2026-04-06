import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { ROLE_PERMISSIONS } from "@/lib/types"
import { PatientsList } from "@/components/patients-list"

export default async function PacientesPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const permissions = ROLE_PERMISSIONS[profile?.role ?? "recepcionista"]
  console.log("role:", profile?.role, "permissions:", permissions)

  const { data: patients } = await supabase
    .from("patients")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Pacientes</h1>
          <p className="text-muted-foreground">
            Gestiona los pacientes registrados en el sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/pacientes/nuevo">
            <Plus className="mr-2 size-4" />
            Nuevo Paciente
          </Link>
        </Button>
      </div>

      <PatientsList
        patients={patients || []}
        permissions={permissions}
      />
    </div>
  )
}