import { createClient } from "@/lib/supabase/server"
import { ClinicalRecordForm } from "@/components/clinical-record-form"

export default async function NuevaHistoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ paciente?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get patient if pre-selected
  let patient = null
  if (params.paciente) {
    const { data } = await supabase
      .from("patients")
      .select("*")
      .eq("id", params.paciente)
      .single()
    patient = data
  }

  // Get all patients for dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, identification_number")
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
      />
    </div>
  )
}
