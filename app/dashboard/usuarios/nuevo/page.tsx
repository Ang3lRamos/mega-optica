import { UserForm } from "@/components/user-form"

export default function NuevoUsuarioPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Nuevo Usuario
        </h1>
        <p className="text-muted-foreground">
          Registra un nuevo usuario en el sistema
        </p>
      </div>

      <UserForm />
    </div>
  )
}