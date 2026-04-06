import { notFound } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { ArrowLeft, Edit, FileText, Plus, Eye } from "lucide-react"
import { EXAM_TYPE_LABELS, ROLE_PERMISSIONS } from "@/lib/types"

export default async function PacienteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user!.id)
    .single()

  const permissions = ROLE_PERMISSIONS[profile?.role ?? "recepcionista"]

  const { data: patient } = await supabase
    .from("patients")
    .select("*")
    .eq("id", id)
    .single()

  if (!patient) notFound()

  const { data: records } = await supabase
    .from("clinical_records")
    .select(`
      id,
      exam_date,
      exam_type,
      diagnosis,
      optometrist:profiles!clinical_records_optometrist_id_fkey (
        full_name
      )
    `)
    .is("deleted_at", null)
    .eq("patient_id", id)
    .order("exam_date", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/pacientes">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {patient.full_name}
            </h1>
            <p className="text-muted-foreground">
              {patient.identification_type}: {patient.identification_number}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/pacientes/${id}/editar`}>
              <Edit className="mr-2 size-4" />
              Editar
            </Link>
          </Button>
          {permissions.canCreateRecords && (
            <Button asChild>
              <Link href={`/dashboard/historias/nueva?paciente=${id}`}>
                <Plus className="mr-2 size-4" />
                Nueva Historia
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Datos Personales</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Género</p>
                <p className="font-medium">{patient.gender === "M" ? "Masculino" : "Femenino"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Edad</p>
                <p className="font-medium">{patient.age} años</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                <p className="font-medium">{new Date(patient.birth_date).toLocaleDateString("es-CO")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Teléfono</p>
                <p className="font-medium">{patient.phone || "-"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Correo Electrónico</p>
              <p className="font-medium">{patient.email || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dirección</p>
              <p className="font-medium">{patient.address || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Datos Laborales</CardTitle></CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Empresa</p>
              <p className="font-medium">{patient.company || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ocupación / Cargo</p>
              <p className="font-medium">{patient.occupation || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Fecha de Registro</p>
              <p className="font-medium">{new Date(patient.created_at).toLocaleDateString("es-CO")}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historias Clínicas</CardTitle>
          <CardDescription>{records?.length || 0} registros encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          {records && records.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Tipo de Examen</TableHead>
                    <TableHead className="hidden md:table-cell">Diagnóstico</TableHead>
                    <TableHead className="hidden lg:table-cell">Optómetra</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => {
                    const optometrist = record.optometrist as { full_name: string } | null
                    return (
                      <TableRow key={record.id}>
                        <TableCell>
                          {new Date(record.exam_date).toLocaleDateString("es-CO")}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {EXAM_TYPE_LABELS[record.exam_type as keyof typeof EXAM_TYPE_LABELS] || record.exam_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate">
                          {record.diagnosis || "-"}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {optometrist?.full_name || "-"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {permissions.canCreateRecords && (
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/dashboard/historias/${record.id}`}>
                                  <Eye className="size-4" />
                                  <span className="sr-only">Ver</span>
                                </Link>
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              No hay historias clínicas registradas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}