import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientForm } from "@/components/patient-form"
import { Patient } from "@/lib/types"

export default async function EditarPacientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Verificar rol del usuario
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  if (profile?.role === "recepcionista") {
    redirect("/dashboard/pacientes")
  }

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single()

  if (!patient) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Editar Paciente
        </h1>
        <p className="text-muted-foreground">
          Modifica los datos del paciente {patient.full_name}
        </p>
      </div>

      <PatientForm patient={patient as Patient} isEdit />
    </div>
  )
}