"use client"

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer"
import { ClinicalRecord, Patient, Profile, EXAM_TYPE_LABELS } from "@/lib/types"

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
  logoSubtitle: { fontSize: 10, color: "#666" },
  nit: { fontSize: 8, color: "#666" },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#3b5998",
  },
  section: { marginBottom: 10 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    backgroundColor: "#e8eef7",
    padding: 5,
    marginBottom: 5,
    color: "#3b5998",
  },
  row: { flexDirection: "row", marginBottom: 3 },
  col2: { width: "50%", paddingRight: 5 },
  col3: { width: "33.33%", paddingRight: 5 },
  col4: { width: "25%", paddingRight: 5 },
  label: { fontSize: 8, color: "#666" },
  value: { fontSize: 9, fontWeight: "bold" },
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
  tableHeader: { backgroundColor: "#f5f5f5" },
  tableCell: { padding: 4, flex: 1, fontSize: 8, textAlign: "center" },
  tableCellLabel: {
    padding: 4,
    width: 80,
    fontSize: 8,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
  },
  consentSection: {
    marginTop: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "solid",
    fontSize: 7,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureImage: {
    width: 120,
    height: 50,
    objectFit: "contain",
    marginBottom: 4,
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    borderTopStyle: "solid",
    width: "100%",
    paddingTop: 4,
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
  conceptBox: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#3b5998",
    borderStyle: "solid",
    backgroundColor: "#e8eef7",
    marginTop: 5,
    alignSelf: "flex-start",
  },
})

interface VisiometryPDFProps {
  record: ClinicalRecord
  patient: Patient
  optometrist: Profile
}

export function VisiometryPDF({ record, patient, optometrist }: VisiometryPDFProps) {
  const examDate = new Date(record.exam_date)
  const va = record.visual_acuity

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>Mega Óptica</Text>
            <Text style={styles.logoSubtitle}>Salud Visual</Text>
            <Text style={styles.nit}>NIT: </Text>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 9 }}>Fecha: {examDate.toLocaleDateString("es-CO")}</Text>
            <Text style={{ fontSize: 9 }}>Tipo: {EXAM_TYPE_LABELS[record.exam_type as keyof typeof EXAM_TYPE_LABELS]}</Text>
          </View>
        </View>

        <Text style={styles.title}>VISIOMETRÍA</Text>

        {/* Motivo de Consulta */}
        {record.consultation_reason && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MOTIVO DE CONSULTA</Text>
            <Text style={styles.value}>{record.consultation_reason}</Text>
          </View>
        )}

        {/* Datos del Paciente */}
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

        {/* Antecedentes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ANTECEDENTES</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Personales</Text>
              <Text style={styles.value}>
                {(record.personal_history as string[] || []).join(", ") || "-"}
                {record.personal_history_other ? ` | ${record.personal_history_other}` : ""}
              </Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Familiares</Text>
              <Text style={styles.value}>
                {(record.family_history as string[] || []).join(", ") || "-"}
                {record.family_history_other ? ` | ${record.family_history_other}` : ""}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col3}>
              <Text style={styles.label}>Cargo / Tiempo</Text>
              <Text style={styles.value}>{record.time_in_job || "-"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Exposiciones</Text>
              <Text style={styles.value}>
                {(record.occupational_exposures as string[] || []).join(", ") || "-"}
              </Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Lentes formulados</Text>
              <Text style={styles.value}>
                {record.has_prescribed_lenses ? `Sí - ${record.lens_usage?.replace(/_/g, " ") || ""}` : "No"}
              </Text>
            </View>
          </View>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Cirugía ocular</Text>
              <Text style={styles.value}>{record.ocular_surgery ? record.surgery_details || "Sí" : "No"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Sintomatología actual</Text>
              <Text style={styles.value}>{record.current_symptoms ? record.symptoms_details || "Sí" : "No"}</Text>
            </View>
          </View>
        </View>

        {/* Agudeza Visual */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AGUDEZA VISUAL</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLabel}></Text>
              <Text style={styles.tableCell}>V.L. Sin Corr.</Text>
              <Text style={styles.tableCell}>V.L. Con Corr.</Text>
              <Text style={styles.tableCell}>V.C. Sin Corr.</Text>
              <Text style={styles.tableCell}>V.C. Con Corr.</Text>
              <Text style={styles.tableCell}>PH</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OD (Derecho)</Text>
              <Text style={styles.tableCell}>{va?.od_sin_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.od_con_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.od_sin_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.od_con_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{record.ph_od || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OI (Izquierdo)</Text>
              <Text style={styles.tableCell}>{va?.oi_sin_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.oi_con_correccion_lejana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.oi_sin_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{va?.oi_con_correccion_cercana || "-"}</Text>
              <Text style={styles.tableCell}>{record.ph_oi || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>AO (Ambos)</Text>
              <Text style={styles.tableCell}>{record.ao_far_without_correction || "-"}</Text>
              <Text style={styles.tableCell}>{record.ao_far_with_correction || "-"}</Text>
              <Text style={styles.tableCell}>{record.ao_near_without_correction || "-"}</Text>
              <Text style={styles.tableCell}>{record.ao_near_with_correction || "-"}</Text>
              <Text style={styles.tableCell}>-</Text>
            </View>
          </View>
        </View>

        {/* Examen Externo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EXAMEN EXTERNO</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLabel}></Text>
              <Text style={styles.tableCell}>OD</Text>
              <Text style={styles.tableCell}>OI</Text>
            </View>
            {[
              { label: "Párpados", od: record.ext_parpados_od, oi: record.ext_parpados_oi },
              { label: "Conjuntiva", od: record.ext_conjuntiva_od, oi: record.ext_conjuntiva_oi },
              { label: "Córnea", od: record.ext_cornea_od, oi: record.ext_cornea_oi },
              { label: "Iris", od: record.ext_iris_od, oi: record.ext_iris_oi },
              { label: "Pupila", od: record.ext_pupila_od, oi: record.ext_pupila_oi },
              { label: "Cristalino", od: record.ext_cristalino_od, oi: record.ext_cristalino_oi },
            ].map((row) => (
              <View key={row.label} style={styles.tableRow}>
                <Text style={styles.tableCellLabel}>{row.label}</Text>
                <Text style={styles.tableCell}>{row.od || "Normal"}</Text>
                <Text style={styles.tableCell}>{row.oi || "Normal"}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.row, { marginTop: 5 }]}>
            <View style={styles.col3}>
              <Text style={styles.label}>Motilidad</Text>
              <Text style={styles.value}>{record.ext_motilidad || "Normal"}</Text>
            </View>
            <View style={styles.col3}>
              <Text style={styles.label}>Cover Test</Text>
              <Text style={styles.value}>{record.ext_cover_test || "Normal"}</Text>
            </View>
          </View>
          {record.ext_observations && (
            <View style={{ marginTop: 4 }}>
              <Text style={styles.label}>Observaciones</Text>
              <Text style={styles.value}>{record.ext_observations}</Text>
            </View>
          )}
        </View>

        {/* Refracción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>REFRACCIÓN</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLabel}></Text>
              <Text style={styles.tableCell}>Esfera</Text>
              <Text style={styles.tableCell}>Cilindro</Text>
              <Text style={styles.tableCell}>Eje</Text>
              <Text style={styles.tableCell}>ADD</Text>
              <Text style={styles.tableCell}>AV</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OD</Text>
              <Text style={styles.tableCell}>{record.refraction_od_esfera || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_od_cilindro || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_od_eje || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_od_add || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_od_av || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OI</Text>
              <Text style={styles.tableCell}>{record.refraction_oi_esfera || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_oi_cilindro || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_oi_eje || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_oi_add || "-"}</Text>
              <Text style={styles.tableCell}>{record.refraction_oi_av || "-"}</Text>
            </View>
          </View>
          <View style={[styles.row, { marginTop: 5 }]}>
            <View style={styles.col2}>
              <Text style={styles.label}>DP (mm)</Text>
              <Text style={styles.value}>{record.refraction_dp || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Tipo de lente</Text>
              <Text style={styles.value}>{record.refraction_lens_type || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Queratometría */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUERATOMETRÍA</Text>
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <Text style={styles.tableCellLabel}></Text>
              <Text style={styles.tableCell}>K1</Text>
              <Text style={styles.tableCell}>K2</Text>
              <Text style={styles.tableCell}>Eje</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OD</Text>
              <Text style={styles.tableCell}>{record.keratometry_od_k1 || "-"}</Text>
              <Text style={styles.tableCell}>{record.keratometry_od_k2 || "-"}</Text>
              <Text style={styles.tableCell}>{record.keratometry_od_eje || "-"}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>OI</Text>
              <Text style={styles.tableCell}>{record.keratometry_oi_k1 || "-"}</Text>
              <Text style={styles.tableCell}>{record.keratometry_oi_k2 || "-"}</Text>
              <Text style={styles.tableCell}>{record.keratometry_oi_eje || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Test Complementarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TEST COMPLEMENTARIOS</Text>
          <View style={styles.row}>
            <View style={styles.col2}>
              <Text style={styles.label}>Ishihara</Text>
              <Text style={styles.value}>{record.test_ishihara || "-"}</Text>
            </View>
            <View style={styles.col2}>
              <Text style={styles.label}>Estereopsis</Text>
              <Text style={styles.value}>{record.test_estereopsis || "-"}</Text>
            </View>
          </View>
          {record.test_others && (
            <View style={{ marginTop: 4 }}>
              <Text style={styles.label}>Otros</Text>
              <Text style={styles.value}>{record.test_others}</Text>
            </View>
          )}
        </View>

        {/* Diagnóstico */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DIAGNÓSTICO</Text>
          <Text style={styles.value}>{record.diagnosis || "-"}</Text>
        </View>

        {/* Observaciones */}
        {record.observations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OBSERVACIONES</Text>
            <Text style={styles.value}>{record.observations}</Text>
          </View>
        )}

        {/* Conducta */}
        {record.conduct && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONDUCTA / RECOMENDACIONES</Text>
            <Text style={styles.value}>{record.conduct}</Text>
          </View>
        )}

        {/* Concepto Ocupacional */}
        {record.occupational_concept && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>CONCEPTO OCUPACIONAL</Text>
            <View style={styles.conceptBox}>
              <Text style={{ fontSize: 11, fontWeight: "bold", color: "#3b5998" }}>
                {record.occupational_concept}
              </Text>
            </View>
          </View>
        )}

        <View style={styles.row}>
          <Text style={styles.label}>Remisión a EPS: </Text>
          <Text style={styles.value}>{record.eps_referral ? "Sí" : "No"}</Text>
        </View>

        {/* Consentimiento */}
        <View style={styles.consentSection}>
          <Text style={{ fontWeight: "bold", marginBottom: 4 }}>CONSENTIMIENTO INFORMADO</Text>
          <Text>
            Yo, {patient.full_name}, identificado con {patient.identification_type} No. {patient.identification_number},
            autorizo al profesional abajo mencionado a que se me realice de manera voluntaria el examen médico ocupacional,
            exámenes complementarios y dejo constancia que tuve la oportunidad de manifestar mi consentimiento para la
            realización del examen médico ocupacional y/o exámenes complementarios necesarios y referenciados en este documento.
            Comprendo el propósito y los beneficios, interpretación, limitaciones y riesgos del examen médico ocupacional
            y/o exámenes complementarios, a partir de la información recibida por el profesional abajo mencionado.
            Certifico que la información que he suministrado es verdadera, completa y acepto el manejo de confidencialidad
            que el profesional de a la misma.
          </Text>
        </View>

        {/* Firmas */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBox}>
            {record.signature_professional ? (
              <Image src={record.signature_professional} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 50 }} />
            )}
            <View style={styles.signatureLine}>
              <Text style={{ fontWeight: "bold" }}>PROFESIONAL</Text>
              <Text>{record.professional_name || optometrist.full_name}</Text>
              <Text style={{ fontSize: 7 }}>
                {record.professional_registration ? `TP: ${record.professional_registration}` : "Optómetra"}
              </Text>
            </View>
          </View>
          <View style={styles.signatureBox}>
            {record.signature_patient ? (
              <Image src={record.signature_patient} style={styles.signatureImage} />
            ) : (
              <View style={{ height: 50 }} />
            )}
            <View style={styles.signatureLine}>
              <Text style={{ fontWeight: "bold" }}>ASPIRANTE O TRABAJADOR</Text>
              <Text>{patient.full_name}</Text>
              <Text style={{ fontSize: 7 }}>{patient.identification_type}: {patient.identification_number}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Mega Óptica - Salud Visual | NIT: 
        </Text>
      </Page>
    </Document>
  )
}