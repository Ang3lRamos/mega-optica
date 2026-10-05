import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TIME_ZONE = 'America/Bogota'
const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/

// Convierte "YYYY-MM-DD" (columnas DATE) en un Date local, sin desfase por UTC
export function parseDateOnly(value: string): Date {
  const match = DATE_ONLY.exec(value)
  if (!match) return new Date(value)
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
}

// Formatea columnas DATE ("YYYY-MM-DD") o TIMESTAMPTZ en hora de Colombia
export function formatDate(value: string | null | undefined): string {
  if (!value) return ''
  const match = DATE_ONLY.exec(value)
  if (match) {
    const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])))
    return date.toLocaleDateString('es-CO', { timeZone: 'UTC' })
  }
  return new Date(value).toLocaleDateString('es-CO', { timeZone: TIME_ZONE })
}

// Fecha de hoy en Colombia como "YYYY-MM-DD"
export function todayLocal(): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date())
}
