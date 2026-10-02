"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"

/**
 * Barra de progreso fina en la parte superior durante la navegación entre páginas.
 * Arranca al hacer clic en un enlace interno y termina cuando cambia la URL.
 */
export function NavigationProgress() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)
  const trickle = useRef<ReturnType<typeof setInterval> | null>(null)
  const hide = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = () => {
    if (trickle.current) clearInterval(trickle.current)
    if (hide.current) clearTimeout(hide.current)
    trickle.current = null
    hide.current = null
  }

  // Iniciar al hacer clic en un enlace interno hacia otra URL
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement).closest("a")
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      clearTimers()
      setVisible(true)
      setProgress(10)
      // Avanza cada vez más despacio sin llegar nunca al 100% hasta que termine la navegación
      trickle.current = setInterval(() => {
        setProgress((p) => (p < 90 ? p + (90 - p) * 0.1 : p))
      }, 200)
    }

    document.addEventListener("click", handleClick, true)
    return () => document.removeEventListener("click", handleClick, true)
  }, [])

  // Completar cuando la nueva página ya se muestra
  useEffect(() => {
    if (!trickle.current) return
    clearTimers()
    setProgress(100)
    hide.current = setTimeout(() => {
      setVisible(false)
      setProgress(0)
    }, 300)
  }, [pathname, searchParams])

  useEffect(() => clearTimers, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-0.5"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 300ms ease" }}
    >
      <div
        className="h-full bg-primary shadow-[0_0_8px_var(--color-primary)]"
        style={{ width: `${progress}%`, transition: "width 200ms ease-out" }}
      />
    </div>
  )
}
