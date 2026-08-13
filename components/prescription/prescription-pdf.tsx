import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#1E293B",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#0D9488",
    paddingBottom: 15,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0D9488",
  },
  subtitle: {
    fontSize: 9,
    color: "#64748B",
    marginTop: 2,
  },
  doctorInfo: {
    alignItems: "flex-end",
  },
  doctorName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F172A",
  },
  specialty: {
    fontSize: 9,
    color: "#0D9488",
    fontWeight: "bold",
  },
  patientBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 6,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  boxRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    color: "#64748B",
  },
  value: {
    color: "#0F172A",
    fontWeight: "bold",
  },
  diagnosisHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0D9488",
    marginBottom: 6,
  },
  diagnosisBox: {
    padding: 10,
    backgroundColor: "#F0FDFA",
    borderColor: "#CCFBF1",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 20,
  },
  rxSectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingBottom: 4,
  },
  table: {
    width: "100%",
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  thName: { width: "35%", fontWeight: "bold", color: "#475569" },
  thDose: { width: "20%", fontWeight: "bold", color: "#475569" },
  thFreq: { width: "25%", fontWeight: "bold", color: "#475569" },
  thDur: { width: "20%", fontWeight: "bold", color: "#475569" },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tdName: { width: "35%", fontWeight: "bold", color: "#0F172A" },
  tdDose: { width: "20%", color: "#334155" },
  tdFreq: { width: "25%", color: "#334155" },
  tdDur: { width: "20%", color: "#334155" },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 36,
    right: 36,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  signatureBox: {
    alignItems: "flex-end",
  },
  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: "#94A3B8",
    marginBottom: 4,
  },
});

export interface PDFPrescriptionData {
  doctorName: string;
  doctorSpecialty: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  date: string;
  diagnosis: string;
  medicines: Array<{ name: string; dose: string; frequency: string; duration: string }>;
}

export function PrescriptionPDFDocument({ data }: { data: PDFPrescriptionData }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logoText}>CLINICO HEALTH</Text>
            <Text style={styles.subtitle}>Verified Telehealth Digital E-Prescription</Text>
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{data.doctorName}</Text>
            <Text style={styles.specialty}>{data.doctorSpecialty}</Text>
          </View>
        </View>

        {/* Patient Details Box */}
        <View style={styles.patientBox}>
          <View style={styles.boxRow}>
            <Text style={styles.label}>Patient Name: <Text style={styles.value}>{data.patientName}</Text></Text>
            <Text style={styles.label}>Date: <Text style={styles.value}>{data.date}</Text></Text>
          </View>
          <View style={styles.boxRow}>
            <Text style={styles.label}>Age / Gender: <Text style={styles.value}>{data.patientAge} Yrs / {data.patientGender}</Text></Text>
            <Text style={styles.label}>Rx Ref: <Text style={styles.value}>CLN-RX-{Math.floor(100000 + Math.random() * 900000)}</Text></Text>
          </View>
        </View>

        {/* Diagnosis */}
        <Text style={styles.diagnosisHeader}>Clinical Diagnosis</Text>
        <View style={styles.diagnosisBox}>
          <Text style={{ fontSize: 11, fontWeight: "bold", color: "#0F766E" }}>{data.diagnosis}</Text>
        </View>

        {/* Prescribed Medicines Table */}
        <Text style={styles.rxSectionHeader}>Rx - Prescribed Medications</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thName}>Medicine Name</Text>
            <Text style={styles.thDose}>Dosage</Text>
            <Text style={styles.thFreq}>Frequency</Text>
            <Text style={styles.thDur}>Duration</Text>
          </View>
          {data.medicines.map((med, idx) => (
            <View key={idx} style={styles.tableRow}>
              <Text style={styles.tdName}>{med.name}</Text>
              <Text style={styles.tdDose}>{med.dose}</Text>
              <Text style={styles.tdFreq}>{med.frequency}</Text>
              <Text style={styles.tdDur}>{med.duration}</Text>
            </View>
          ))}
        </View>

        {/* Footer Signature */}
        <View style={styles.footer}>
          <Text style={{ color: "#94A3B8", fontSize: 8 }}>
            Digitally signed via Clinico Encrypted E-Prescription Portal
          </Text>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={{ fontSize: 9, fontWeight: "bold" }}>{data.doctorName}</Text>
            <Text style={{ fontSize: 8, color: "#64748B" }}>Authorized Physician Signature</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
