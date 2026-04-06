# 👁️ Mega Óptica — Sistema de Visiometría

> Sistema web para la gestión de pacientes, historias clínicas y visiometrías ocupacionales.

---

## 📋 Tabla de Contenidos

- [🚀 Tecnologías](#-tecnologías)
- [🏗️ Arquitectura](#️-arquitectura)
- [⚙️ Instalación](#️-instalación)
- [🔐 Variables de Entorno](#-variables-de-entorno)
- [🗄️ Base de Datos](#️-base-de-datos)
- [👥 Roles y Permisos](#-roles-y-permisos)
- [📦 Funcionalidades](#-funcionalidades)
- [🧭 Navegación](#-navegación)
- [📄 Generación de PDF](#-generación-de-pdf)
- [🗑️ Soft Delete](#️-soft-delete)
- [🚢 Despliegue](#-despliegue)

---

## 🚀 Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [Next.js](https://nextjs.org/) | 15 | Framework principal (App Router) |
| [Supabase](https://supabase.com/) | — | Base de datos y autenticación |
| [TypeScript](https://www.typescriptlang.org/) | — | Tipado estático |
| [Tailwind CSS](https://tailwindcss.com/) | — | Estilos |
| [shadcn/ui](https://ui.shadcn.com/) | — | Componentes de UI |
| [@react-pdf/renderer](https://react-pdf.org/) | — | Generación de PDFs |
| [Vercel](https://vercel.com/) | — | Despliegue |

---

## 🏗️ Arquitectura

```
mega-optica/
├── app/
│   ├── api/
│   │   └── users/
│   │       ├── create/route.ts      # Crear usuarios (service role)
│   │       ├── update/route.ts      # Actualizar usuarios
│   │       └── delete/route.ts      # Eliminar usuarios
│   ├── dashboard/
│   │   ├── page.tsx                 # Dashboard principal
│   │   ├── pacientes/               # CRUD pacientes
│   │   ├── historias/               # CRUD historias clínicas
│   │   ├── usuarios/                # Gestión de usuarios (admin)
│   │   └── configuracion/           # Perfil del profesional
│   └── auth/                        # Login y autenticación
├── components/
│   ├── clinical-record-form.tsx     # Formulario historia clínica (5 tabs)
│   ├── visiometry-pdf.tsx           # Plantilla PDF
│   ├── pdf-download-button.tsx      # Botón descarga PDF
│   ├── patients-list.tsx            # Lista de pacientes
│   ├── records-list.tsx             # Lista de historias
│   ├── patient-form.tsx             # Formulario paciente
│   ├── user-form.tsx                # Formulario usuario
│   ├── profile-form.tsx             # Formulario perfil profesional
│   └── delete-user-button.tsx       # Botón eliminar usuario
├── lib/
│   ├── types.ts                     # Interfaces y constantes
│   └── supabase/
│       ├── client.ts                # Cliente browser
│       └── server.ts                # Cliente servidor
└── public/
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/mega-optica.git
cd mega-optica
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

```bash
cp .env.example .env.local
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 🔐 Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```env
# Supabase - Proyecto
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Supabase - Service Role (solo para operaciones de admin)
# ⚠️ NUNCA expongas esta clave en el cliente
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key
```

> ⚠️ **Importante:** La `SUPABASE_SERVICE_ROLE_KEY` solo se usa en API Routes del servidor (`/api/users/*`). Nunca debe exponerse en el cliente.

---

## 🗄️ Base de Datos

### Tablas principales

#### `profiles`
Extiende `auth.users` de Supabase con datos adicionales del usuario.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` | FK → `auth.users` |
| `full_name` | `text` | Nombre completo |
| `role` | `text` | `administrador` / `optometra` / `recepcionista` |
| `professional_registration` | `text` | Número de tarjeta profesional |
| `sst` | `text` | Especialidad SST |

#### `patients`
Datos de los pacientes registrados.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` | PK |
| `identification_type` | `text` | CC, TI, CE, etc. |
| `identification_number` | `text` | Número de identificación |
| `full_name` | `text` | Nombre completo |
| `gender` | `text` | M / F / O / NB / GF / ND |
| `birth_date` | `date` | Fecha de nacimiento |
| `age` | `integer` | Edad |
| `company` | `text` | Empresa |
| `occupation` | `text` | Cargo/Ocupación |
| `deleted_at` | `timestamptz` | Soft delete |

#### `clinical_records`
Historias clínicas completas de visiometría.

| Campo | Tipo | Descripción |
|---|---|---|
| `id` | `uuid` | PK |
| `patient_id` | `uuid` | FK → `patients` |
| `optometrist_id` | `uuid` | FK → `profiles` |
| `exam_type` | `text` | Tipo de visiometría |
| `exam_date` | `date` | Fecha del examen |
| `od_far_without_correction` | `text` | AV OD lejos sin corrección |
| `...` | `...` | Todos los campos clínicos |
| `deleted_at` | `timestamptz` | Soft delete |

### Migraciones necesarias

Ejecuta en el **SQL Editor de Supabase**:

```sql
-- Campos profesionales en profiles
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS professional_registration TEXT,
  ADD COLUMN IF NOT EXISTS sst TEXT;

-- SST en historias clínicas
ALTER TABLE clinical_records
  ADD COLUMN IF NOT EXISTS sst TEXT,
  ADD COLUMN IF NOT EXISTS occupational_history_other TEXT,
  ADD COLUMN IF NOT EXISTS time_in_cargo TEXT;

-- Soft delete
ALTER TABLE patients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE clinical_records ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Fix constraint lens_usage
ALTER TABLE clinical_records DROP CONSTRAINT clinical_records_lens_usage_check;
ALTER TABLE clinical_records ADD CONSTRAINT clinical_records_lens_usage_check
  CHECK (lens_usage = ANY (ARRAY[
    'permanentes'::text, 'ocasionales'::text,
    'para_ver_cerca'::text, 'para_ver_lejos'::text, 'otros'::text
  ]));
```

---

## 👥 Roles y Permisos

El sistema maneja 3 roles con permisos diferenciados:

| Permiso | 👤 Recepcionista | 🔬 Optómetra | 👑 Administrador |
|---|:---:|:---:|:---:|
| Crear pacientes | ✅ | ✅ | ✅ |
| Editar pacientes | ✅ | ✅ | ✅ |
| Eliminar pacientes | ❌ | ✅ | ✅ |
| Crear historias clínicas | ❌ | ✅ | ✅ |
| Editar historias clínicas | ❌ | ✅ | ✅ |
| Eliminar historias clínicas | ❌ | ✅ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ✅ |
| Ver configuración | ❌ | ✅ | ✅ |

> 💡 Los administradores no pueden eliminarse a sí mismos ni a otros administradores.

---

## 📦 Funcionalidades

### 🧑‍⚕️ Gestión de Pacientes
- Registro con identificación única (tipo + número)
- Datos personales, laborales y de contacto
- Soporte para géneros no binarios con campo personalizable
- Búsqueda instantánea por nombre o identificación
- Historial de historias clínicas por paciente

### 📋 Historias Clínicas
Formulario dividido en **5 pestañas**:

1. **📝 Datos del Examen** — Paciente, fecha, tipo de visiometría, datos del profesional (nombre, T.P., SST), motivo de consulta
2. **🏥 Antecedentes** — Personales, familiares, ocupacionales (cargo, empresa, tiempo, exposiciones)
3. **👁️ Agudeza Visual** — OD, OI y AO para visión lejana/cercana con y sin corrección, agujero estenopeico
4. **🔬 Examen Clínico** — Examen externo, refracción, queratometría, test complementarios
5. **📊 Diagnóstico** — Diagnóstico, observaciones, conducta, remisión EPS, firma del profesional

### 👤 Gestión de Usuarios (Admin)
- Crear, editar y eliminar usuarios
- Asignación de roles
- No se pueden eliminar administradores
- No se puede eliminar el usuario activo

### ⚙️ Configuración de Perfil
- Editar nombre completo
- Registro profesional / T.P.
- SST (Especialidad)
- Los datos se pre-llenan automáticamente en nuevas historias clínicas

---

## 🧭 Navegación

```
/                          → Redirección automática
/auth/login               → Inicio de sesión
/dashboard                → Panel principal con estadísticas
/dashboard/pacientes      → Lista de pacientes
/dashboard/pacientes/nuevo           → Nuevo paciente
/dashboard/pacientes/[id]            → Detalle paciente
/dashboard/pacientes/[id]/editar     → Editar paciente
/dashboard/historias      → Lista de historias clínicas
/dashboard/historias/nueva           → Nueva historia clínica
/dashboard/historias/[id]            → Detalle historia
/dashboard/historias/[id]/editar     → Editar historia
/dashboard/historias/[id]/pdf        → Ver/descargar PDF
/dashboard/usuarios       → Lista de usuarios (solo admin)
/dashboard/usuarios/nuevo            → Nuevo usuario (solo admin)
/dashboard/usuarios/[id]/editar      → Editar usuario (solo admin)
/dashboard/configuracion  → Perfil profesional (admin y optómetra)
```

---

## 📄 Generación de PDF

El PDF de visiometría incluye:

- 🏢 **Encabezado** — Logo Mega Óptica, NIT, fecha y tipo de examen
- 👤 **Datos del paciente** — Nombre, identificación, género, edad, empresa, ocupación
- 📋 **Antecedentes** — Personales, familiares, ocupacionales completos
- 👁️ **Agudeza visual** — Tabla completa OD/OI/AO
- 🔬 **Examen externo** — Tabla de estructuras oculares
- 💊 **Refracción** — Esfera, cilindro, eje, ADD, AV
- 🔎 **Queratometría** — K1, K2, eje OD/OI
- 🧪 **Test complementarios** — Ishihara, estereopsis, otros
- 📊 **Diagnóstico** — Diagnóstico, observaciones, conducta, EPS
- ✍️ **Firma** — Imagen de firma, nombre, T.P. y SST del profesional

> 💡 El PDF se genera en el cliente usando `@react-pdf/renderer` con carga dinámica para evitar errores de SSR.

---

## 🗑️ Soft Delete

En vez de eliminar registros permanentemente, el sistema usa **soft delete**:

- Al "eliminar" un paciente o historia clínica, se establece `deleted_at = NOW()`
- Los registros con `deleted_at` no nulo no aparecen en la interfaz
- Los datos se conservan en la base de datos

### Restaurar un registro eliminado

Ejecuta en el **SQL Editor de Supabase**:

```sql
-- Restaurar un paciente
UPDATE patients SET deleted_at = NULL WHERE id = 'uuid-del-paciente';

-- Restaurar una historia clínica
UPDATE clinical_records SET deleted_at = NULL WHERE id = 'uuid-de-la-historia';
```

> 💡 Los usuarios de Supabase Auth sí se eliminan permanentemente ya que son gestionados por el sistema de autenticación.

---

## 🚢 Despliegue

### Vercel (recomendado)

1. Conecta tu repositorio en [vercel.com](https://vercel.com)
2. Configura las variables de entorno en el panel de Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Despliega — Vercel detecta Next.js automáticamente

### Variables de entorno en Vercel

Ve a **Settings → Environment Variables** en tu proyecto de Vercel y agrega cada variable para los entornos `Production`, `Preview` y `Development`.

---

## 📝 Notas de Desarrollo

- El formulario de historia clínica **no usa `<form>` HTML** para evitar submit prematuro al navegar entre tabs. El guardado se dispara manualmente con `onClick`.
- La generación de PDF usa **carga dinámica** (`next/dynamic` con `ssr: false`) para evitar errores con `@react-pdf/renderer`.
- Las queries de Supabase siempre filtran con `.is("deleted_at", null)` para excluir registros eliminados.
- La `SUPABASE_SERVICE_ROLE_KEY` solo se usa en **API Routes** del servidor para operaciones de administración de usuarios.

---

<div align="center">
  <p>Desarrollado para <strong>Mega Óptica</strong> 👁️</p>
</div>