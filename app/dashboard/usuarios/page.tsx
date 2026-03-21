import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserPlus } from "lucide-react"
import Link from "next/link"
import { DeleteUserButton } from "@/components/delete-user-button"

const roleColors: Record<string, string> = {
  administrador: "bg-red-100 text-red-800",
  optometra: "bg-blue-100 text-blue-800",
  recepcionista: "bg-green-100 text-green-800",
}

const roleLabels: Record<string, string> = {
  administrador: "Administrador",
  optometra: "Optómetra",
  recepcionista: "Recepcionista",
}

export default async function UsuariosPage() {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profiles } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("full_name")

  const { data: authData } = await supabaseAdmin.auth.admin.listUsers()
  const emailMap = Object.fromEntries(
    (authData?.users ?? []).map((u) => [u.id, u.email])
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="text-muted-foreground">
            Gestiona los usuarios del sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/usuarios/nuevo">
            <UserPlus className="mr-2 size-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Usuarios Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {!profiles || profiles.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay usuarios registrados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Fecha de Creación</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell className="font-medium">
                      {profile.full_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {emailMap[profile.id] || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={roleColors[profile.role]}>
                        {roleLabels[profile.role] || profile.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(profile.created_at).toLocaleDateString("es-CO")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/dashboard/usuarios/${profile.id}/editar`}>
                            Editar
                          </Link>
                        </Button>
                        <DeleteUserButton id={profile.id} name={profile.full_name} />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}