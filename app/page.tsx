import { redirect } from "next/navigation"

export default function Home() {
  // This will be handled by middleware, but as a fallback
  redirect("/auth/login")
}
