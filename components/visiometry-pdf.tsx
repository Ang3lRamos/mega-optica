"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer"
import { ClinicalRecord, Patient, Profile, EXAM_TYPE_LABELS } from "@/lib/types"

// Register fonts (using system fonts as fallback)
Font.register({
  family: "Helvetica",
  fonts: [
    { src: "Helvetica" },
    { src: "Helvetica-Bold", fontWeight: "bold" },
  ],
})

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#3b5998",
    borderBottomStyle: "solid",
    paddingBottom: 10,
  },
  logo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3b5998",
  },
  logoSubtitle: {
    fontSize: 10,
    color: "#666",
  },
  nit: {
    fontSize: 8,
    color: "#666",
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#3b5998",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#e8eef7",
    padding: 5,
    marginBottom: 5,
    color: "#3b5998",
  },
  row: {
    flexDirection: "row",
    marginBottom: 3,
  },
  col2: {
    width: "50%",
    paddingRight: 5,
  },
  col3: {
    width: "33.33%",
    paddingRight: 5,
  },
  col4: {
    width: "25%",
    paddingRight: 5,
  },
  label: {
    fontSize: 8,
    color: "#666",
  },
  value: {
    fontSize: 9,
    fontWeight: "bold",
  },
  table: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    borderBottomStyle: "solid",
  },
  tableHeader: {
    backgroundColor: "#f5f5f5",
  },
  tableCell: {
    padding: 4,
    flex: 1,
    fontSize: 8,
    textAlign: "center",
  },
  tableCellLabel: {
    padding: 4,
    width: 80,
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "solid",
    marginRight: 5,
  },
  checkboxChecked: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "solid",
    marginRight: 5,
    backgroundColor: "#3b5998",
  },
  consentSection: {
    marginTop: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    fontSize: 7,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 30,
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderTopStyle: "solid",
    paddingTop: 5,
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#666",
  },
})

interface VisiometryPDFProps {
  record: ClinicalRecord
  patient: Patient
  optometrist: Profile
}

export function VisiometryPDF({ record, patient, optometrist }: VisiometryPDFProps) {
  const examDate = new Date(record.exam_date)
  const visualAcuity = record.visual_acuity
  const externalExam = record.external_exam
  const coverTest = record.cover_test
  const oftalmoscopia = record.oftalmoscopia
  const queratometria = record.queratometria
  const retinoscopia = record.retinoscopia

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Mega Óptica</Text>
            <Text style={styles.logoSubtitle}>Salud Visual</Text>
            <Text style={styles.nit}>NIT: 92521731-6</Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text>Fecha: {examDate.toLocaleDateString("es-CO")}</Text>
          </View>
        </View>

        <Text style={styles.title}>VISIOMETRÍA</Text>

        {/* Exam Type */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Examen: </Text>
            <Text style={styles.value}>
              {EXAM_TYPE_LABELS[record.exam_type as keyof typeof EXAM_TYPE_LABELS]}
            </Text>
          </View>
        </View>

        {/* Patient Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DATOS DEL PACIENTE</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Nombres y Apellidos</Text>
              <Text style={styles.value}>{patient.full_name}</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.label}>Identificación</Text>
              <Text style={styles.value}>{patient.identification_type}: {patient.identification_number}</Text>
            </View>
            <View style={styles.col4}>
              <Text style={styles.label}>Género / Edad</Text>
              <Text style={styles.value}>{patient.gender === "M" ? "Masculino" : "Femenino"} / {patient.age} años</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Empresa</Text>
              <Text style={styles.value}>{patient.company || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Ocupación</Text>
              <Text style={styles.value}>{patient.occupation || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Occupational Background */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ANTECEDENTES OCUPACIONALES</Text>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>¿Utiliza protección?</Text>
              <Text style={styles.value}>{record.uses_protection ? `Sí - ${record.protection_type}` : "No"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Tiempo en el oficio</Text>
              <Text style={styles.value}>{record.time_in_job || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Previous Exam */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXAMEN DE AGUDEZA VISUAL ANTERIOR</Text>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>¿Visiometría anterior?</Text>
              <Text style={styles.value}>{record.previous_exam ? "Sí" : "No"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>¿Tiene lentes formulados?</Text>
              <Text style={styles.value}>{record.has_prescribed_lenses ? "Sí" : "No"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Forma de uso</Text>
              <Text style={styles.value}>{record.lens_usage?.replace(/_/g, " ") || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Cirugía ocular</Text>
              <Text style={styles.value}>{record.ocular_surgery ? `${record.surgery_details}` : "No"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Sintomatología ocular actual</Text>
              <Text style={styles.value}>{record.current_ocular_symptoms ? record.symptoms_details : "No"}</Text>
            </View>
          </View>
        </View>

        {/* Visual Acuity Table */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGUDEZA VISUAL</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLabel}></Text>
              <Text style={styles.tableCell}>V.L. Sin Corr.</Text>
              <Text style={styles.tableCell}>V.L. Con Corr.</Text>
              <Text style={styles.tableCell}>V.C. Sin Corr.</Text>
              <Text style={styles.tableCell}>V.C. Con Corr.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OD (Derecho)</Text>
              <Text style={styles.tableCell}>{visualAcuity?.od_sin_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.od_con_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.od_sin_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.od_con_correccion_cercana || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OI (Izquierdo)</Text>
              <Text style={styles.tableCell}>{visualAcuity?.oi_sin_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.oi_con_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.oi_sin_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{visualAcuity?.oi_con_correccion_cercana || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Complementary Exams */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXÁMENES COMPLEMENTARIOS</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Examen Externo OD</Text>
              <Text style={styles.value}>{externalExam?.od || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Examen Externo OI</Text>
              <Text style={styles.value}>{externalExam?.oi || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Cover Test Lejos</Text>
              <Text style={styles.value}>{coverTest?.lejos || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Cover Test Cerca</Text>
              <Text style={styles.value}>{coverTest?.cerca || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Oftalmoscopía OD</Text>
              <Text style={styles.value}>{oftalmoscopia?.od || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Oftalmoscopía OI</Text>
              <Text style={styles.value}>{oftalmoscopia?.oi || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>Visión Cromática</Text>
              <Text style={styles.value}>{record.chromatic_vision === "normal" ? "Normal" : "Anormal"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Estereopsis</Text>
              <Text style={styles.value}>{record.estereopsis || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Queratometría OD</Text>
              <Text style={styles.value}>{queratometria?.od || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Queratometría OI</Text>
              <Text style={styles.value}>{queratometria?.oi || "-"}</Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Retinoscopía OD</Text>
              <Text style={styles.value}>{retinoscopia?.od || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Retinoscopía OI</Text>
              <Text style={styles.value}>{retinoscopia?.oi || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Diagnosis */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAGNÓSTICO</Text>
          <Text style={styles.value}>{record.diagnosis || "-"}</Text>
        </View>

        {/* Observations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>OBSERVACIONES</Text>
          <Text style={styles.value}>{record.observations || "-"}</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Remisión a EPS: </Text>
            <Text style={styles.value}>{record.eps_referral ? "Sí" : "No"}</Text>
          </View>
        </View>

        {/* Consent */}
        <View style={styles.consentSection}>
          <Text style={{ fontWeight: "bold", marginBottom: 5 }}>CONSENTIMIENTO INFORMADO</Text>
          <Text>
            Yo, {patient.full_name}, identificado con {patient.identification_type} No. {patient.identification_number}, 
            autorizo al profesional abajo mencionado a que se me realice de manera voluntaria el examen médico ocupacional, 
            exámenes complementarios y dejo constancia que tuve la oportunidad de manifestar mi consentimiento para la 
            realización del examen médico ocupacional y/o exámenes complementarios necesarios y referenciados en este documento. 
            Comprendo el propósito y los beneficios, interpretación, limitaciones y riesgos del examen médico ocupacional 
            y/o exámenes complementarios, a partir de la información recibida por el profesional abajo mencionado. 
            Certifico que la información que he suministrado es verdadera, completa y acepto el manejo de confidencialidad 
            que el profesional de a la misma. Autorizo que suministre la información necesaria a las personas o entidades 
            contempladas en la legislación para el buen cumplimiento del programa de Salud Ocupacional.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            <Text style={{ fontWeight: "bold" }}>PROFESIONAL</Text>
            <Text>{optometrist.full_name}</Text>
            <Text>Optómetra</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontWeight: "bold" }}>ASPIRANTE O TRABAJADOR</Text>
            <Text>{patient.full_name}</Text>
            <Text>{patient.identification_type}: {patient.identification_number}</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Mega Óptica - Salud Visual | NIT: 92521731-6
        </Text>
      </Page>
    </Document>
  )
}
