import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClinicalRecordForm } from "@/components/clinical-record-form"

export default async function EditarHistoriaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Obtener perfil del usuario actual
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, professional_registration, sst, role")
    .eq("id", user!.id)
    .single()

  // Obtener la historia clínica
  const { data: record } = await supabase
    .from("clinical_records")
    .select("*")
    .eq("id", id)
    .single()

  if (!record) notFound()

  // Obtener todos los pacientes para el dropdown
  const { data: patients } = await supabase
    .from("patients")
    .select("id, full_name, identification_number")
    .order("full_name")

  // Obtener el paciente seleccionado
  const { data: selectedPatient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", record.patient_id)
    .single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Editar Historia Clínica
        </h1>
        <p className="text-muted-foreground">
          Modifica los datos del examen de visiometría
        </p>
      </div>

      <ClinicalRecordForm
        patients={patients || []}
        selectedPatient={selectedPatient}
        record={record}
        isEdit
        currentProfile={profile}
      />
    </div>
  )
}