import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar, Activity } from "lucide-react"
import { ROLE_PERMISSIONS } from "@/lib/types"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const permissions = ROLE_PERMISSIONS[profile?.role ?? "recepcionista"]

  const { count: patientsCount } = await supabase
    .from("patients")
    .select("*", { count: "exact", head: true })
    .is("deleted_at", null)

  const { count: recordsCount } = permissions.canCreateRecords
    ? await supabase.from("clinical_records").select("*", { count: "exact", head: true }) .is("deleted_at", null)
    : { count: null }

  const today = new Date().toISOString().split("T")[0]
  const { count: todayRecords } = permissions.canCreateRecords
    ? await supabase
        .from("clinical_records")
        .select("*", { count: "exact", head: true })
        .is("deleted_at", null)
        .gte("exam_date", today)
        .lt("exam_date", `${today}T23:59:59`)
    : { count: null }

  const { data: recentRecords } = permissions.canCreateRecords
    ? await supabase
        .from("clinical_records")
        .select(`id, exam_date, exam_type, patients (full_name, identification_number)`)
        .is("deleted_at", null)
        .order("created_at", { ascending: false })
        .limit(5)
    : { data: null }

  const examTypeLabels: Record<string, string> = {
    ingreso: "Ingreso",
    cambio_ocupacion: "Cambio de Ocupación",
    periodico_programado: "Periódico Programado",
    retiro: "Retiro",
    post_incapacidad: "Post-Incapacidad",
    reintegro: "Reintegro",
    visiometria: "Visiometría",
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Bienvenido al sistema de visiometría de Mega Óptica
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
            <Users className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patientsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Pacientes registrados</p>
          </CardContent>
        </Card>

        {permissions.canCreateRecords && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Historias Clínicas</CardTitle>
                <FileText className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recordsCount || 0}</div>
                <p className="text-xs text-muted-foreground">Total de registros</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoy</CardTitle>
                <Calendar className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayRecords || 0}</div>
                <p className="text-xs text-muted-foreground">Exámenes del día</p>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estado</CardTitle>
            <Activity className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Activo</div>
            <p className="text-xs text-muted-foreground">Sistema operativo</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {permissions.canCreateRecords && (
          <Card>
            <CardHeader>
              <CardTitle>Últimas Historias Clínicas</CardTitle>
              <CardDescription>Los registros más recientes del sistema</CardDescription>
            </CardHeader>
            <CardContent>
              {recentRecords && recentRecords.length > 0 ? (
                <div className="space-y-4">
                  {recentRecords.map((record) => {
                    const patient = record.patients as { full_name: string; identification_number: string } | null
                    return (
                      <div key={record.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div>
                          <p className="font-medium">{patient?.full_name || "Paciente"}</p>
                          <p className="text-sm text-muted-foreground">
                            CC: {patient?.identification_number}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {examTypeLabels[record.exam_type] || record.exam_type}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.exam_date).toLocaleDateString("es-CO")}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center text-muted-foreground">
                  No hay registros recientes
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Accesos directos a las funciones principales</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/dashboard/pacientes/nuevo"
              className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
            >
              <Users className="size-5 text-primary" />
              <div>
                <p className="font-medium">Nuevo Paciente</p>
                <p className="text-sm text-muted-foreground">Registrar un paciente</p>
              </div>
            </Link>
            {permissions.canCreateRecords && (
              <Link
                href="/dashboard/historias/nueva"
                className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent"
              >
                <FileText className="size-5 text-primary" />
                <div>
                  <p className="font-medium">Nueva Historia Clínica</p>
                  <p className="text-sm text-muted-foreground">Crear un registro de visiometría</p>
                </div>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}