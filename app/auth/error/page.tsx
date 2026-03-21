import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-destructive/10 p-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-2xl">Error de Autenticación</CardTitle>
          <CardDescription>
            Hubo un problema al verificar tu sesión. Por favor, intenta iniciar sesión nuevamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/auth/login">
              Volver al inicio de sesión
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
