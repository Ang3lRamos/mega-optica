import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Eye, FileText } from "lucide-react"
import { PatientsSearch } from "@/components/patients-search"

export default async function PacientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams
  const supabase = await createClient()
  const searchQuery = params.q || ""

  let query = supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false })

  if (searchQuery) {
    query = query.or(
      `full_name.ilike.%${searchQuery}%,identification_number.ilike.%${searchQuery}%`
    )
  }

  const { data: patients } = await query.limit(50)

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

      <Card>
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
          <CardDescription>
            {patients?.length || 0} pacientes encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <PatientsSearch defaultValue={searchQuery} />
          </div>

          {patients && patients.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Identificación</TableHead>
                    <TableHead>Nombre Completo</TableHead>
                    <TableHead className="hidden md:table-cell">Género</TableHead>
                    <TableHead className="hidden md:table-cell">Empresa</TableHead>
                    <TableHead className="hidden lg:table-cell">Teléfono</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            {patient.identification_type}
                          </span>
                          <p className="font-medium">{patient.identification_number}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{patient.full_name}</p>
                          <p className="text-sm text-muted-foreground">
                            {patient.age} años
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline">
                          {patient.gender === "M" ? "Masculino" : "Femenino"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.company || "-"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {patient.phone || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/pacientes/${patient.id}`}>
                              <Eye className="size-4" />
                              <span className="sr-only">Ver</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/dashboard/historias/nueva?paciente=${patient.id}`}>
                              <FileText className="size-4" />
                              <span className="sr-only">Nueva Historia</span>
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              {searchQuery
                ? "No se encontraron pacientes con esos criterios"
                : "No hay pacientes registrados"}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
