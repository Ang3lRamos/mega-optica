import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { ROLE_PERMISSIONS } from "@/lib/types"
import { RecordsList } from "@/components/records-list"

export default async function HistoriasPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const permissions = ROLE_PERMISSIONS[profile?.role ?? "optometra"]

  const { data: records } = await supabase
    .from("clinical_records")
    .select(`
      id,
      exam_date,
      exam_type,
      diagnosis,
      patients (
        id,
        full_name,
        identification_number
      ),
      optometrist:profiles!clinical_records_optometrist_id_fkey (
        full_name
      )
    `)
    .order("exam_date", { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Historias Clínicas
          </h1>
          <p className="text-muted-foreground">
            Gestiona los registros de visiometría
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/historias/nueva">
            <Plus className="mr-2 size-4" />
            Nueva Historia
          </Link>
        </Button>
      </div>

      <RecordsList
        records={records || []}
        canDelete={permissions.canDeleteRecords}
      />
    </div>
  )
}