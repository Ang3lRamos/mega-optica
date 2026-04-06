import { createClient } from "@/lib/supabase/server"
import { ClinicalRecordForm } from "@/components/clinical-record-form"

export default async function NuevaHistoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Obtener perfil del usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, professional_registration, sst, role")
    .eq("id", user!.id)
    .single()

  let patient = null
  if (params.paciente) {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("id", params.paciente)
      .single()
    patient = data
  }

  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, identification_number")
    .is("deleted_at", null)
    .order("full_name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nueva Historia Clínica
        </h1>
        <p className="text-muted-foreground">
          Registra un nuevo examen de visiometría
        </p>
      </div>

      <ClinicalRecordForm
        patients={patients || []}
        selectedPatient={patient}
        currentProfile={profile}
      />
    </div>
  )
}