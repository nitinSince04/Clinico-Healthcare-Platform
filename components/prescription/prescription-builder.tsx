"use client";

import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PrescriptionPDFDocument } from "@/components/prescription/prescription-pdf";
import { createPrescription } from "@/lib/actions/prescriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, FileText, Download, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PrescriptionBuilderProps {
  appointment: any;
  doctorName: string;
  doctorSpecialty: string;
  onSuccess: () => void;
}

export function PrescriptionBuilder({
  appointment,
  doctorName,
  doctorSpecialty,
  onSuccess,
}: PrescriptionBuilderProps) {
  const patientName = appointment.patient.name;
  const patientAge = appointment.patient.patientProfile?.age || 30;
  const patientGender = appointment.patient.patientProfile?.gender || "Male";

  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dose: "500mg", frequency: "Twice daily after meals", duration: "7 Days" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [issuedPrescription, setIssuedPrescription] = useState<any>(null);

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dose: "1 tablet", frequency: "Once daily", duration: "5 Days" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updated = [...medicines];
    (updated[index] as any)[field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError("Please enter a clinical diagnosis.");
      return;
    }
    if (medicines.some((m) => !m.name.trim())) {
      setError("Please enter medicine names for all rows.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const res = await createPrescription({
      appointmentId: appointment.id,
      diagnosis,
      medicines,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to issue prescription.");
    } else {
      setIssuedPrescription(res.prescription);
      onSuccess();
    }
  };

  const pdfData = {
    doctorName,
    doctorSpecialty,
    patientName,
    patientAge,
    patientGender,
    date: new Date().toLocaleDateString(),
    diagnosis,
    medicines,
  };

  return (
    <div className="space-y-6">
      {issuedPrescription ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">E-Prescription Issued Successfully!</h4>
          <p className="text-xs text-slate-600">
            Digital prescription generated and linked to patient <span className="font-bold text-slate-900">{patientName}</span>.
          </p>

          <PDFDownloadLink
            document={<PrescriptionPDFDocument data={pdfData} />}
            fileName={`Prescription-${patientName.replace(/\s+/g, "_")}.pdf`}
          >
            {/* @ts-ignore */}
            {({ loading }: { loading: boolean }) => (
              <Button variant="gradient" className="gap-2 font-bold text-xs mt-2">
                <Download className="h-4 w-4" />
                {loading ? "Generating PDF Document..." : "Download Official PDF Prescription"}
              </Button>
            )}
          </PDFDownloadLink>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Diagnosis Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Clinical Diagnosis Summary</label>
            <Input
              placeholder="e.g. Acute Upper Respiratory Tract Infection, Essential Hypertension Stage 1"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
          </div>

          {/* Medicines Builder Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Prescribed Medications List</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddMedicine}
                className="gap-1 text-xs text-teal-700 border-teal-200"
              >
                <Plus className="h-3.5 w-3.5" /> Add Drug Row
              </Button>
            </div>

            <div className="space-y-3">
              {medicines.map((med, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500">Medicine #{idx + 1}</span>
                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Medicine Name (e.g. Amoxicillin)"
                      value={med.name}
                      onChange={(e) => handleMedicineChange(idx, "name", e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Dose (e.g. 500mg, 1 tablet)"
                      value={med.dose}
                      onChange={(e) => handleMedicineChange(idx, "dose", e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <Input
                      placeholder="Frequency (e.g. Twice daily after food)"
                      value={med.frequency}
                      onChange={(e) => handleMedicineChange(idx, "frequency", e.target.value)}
                      required
                    />
                    <Input
                      placeholder="Duration (e.g. 7 Days, 1 Month)"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(idx, "duration", e.target.value)}
                      required
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full text-xs font-bold gap-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Prescription...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" /> Issue & Sign Digital E-Prescription
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
