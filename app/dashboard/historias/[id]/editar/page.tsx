import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ClinicalRecordForm } from "@/components/clinical-record-form"
import { ClinicalRecord } from "@/lib/types"

export default async function EditarHistoriaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: record } = await supabase
    .from("clinical_records")
    .select("*")
    .eq("id", id)
    .single()

  if (!record) {
    notFound()
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
          Editar Historia Clínica
        </h1>
        <p className="text-muted-foreground">
          Modifica los datos de la historia clínica
        </p>
      </div>

      <ClinicalRecordForm
        patients={patients || []}
        record={record as ClinicalRecord}
        isEdit
      />
    </div>
  )
}
