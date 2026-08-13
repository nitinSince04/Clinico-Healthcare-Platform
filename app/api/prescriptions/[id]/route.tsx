import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { db } from "@/lib/db";
import { PrescriptionPDFDocument } from "@/components/prescription/prescription-pdf";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const prescription = await db.prescription.findUnique({
      where: { id: params.id },
      include: {
        doctor: { include: { doctorProfile: true } },
        patient: { include: { patientProfile: true } },
      },
    });

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 });
    }

    let medicines = [];
    try {
      medicines = JSON.parse(prescription.medicines);
    } catch (e) {}

    const pdfData = {
      doctorName: prescription.doctor.name,
      doctorSpecialty: prescription.doctor.doctorProfile?.specialty || "Specialist",
      patientName: prescription.patient.name,
      patientAge: prescription.patient.patientProfile?.age || 30,
      patientGender: prescription.patient.patientProfile?.gender || "Male",
      date: new Date(prescription.createdAt).toLocaleDateString(),
      diagnosis: prescription.diagnosis,
      medicines,
    };

    const pdfBuffer = await renderToBuffer(
      <PrescriptionPDFDocument data={pdfData} /> as any
    );

    return new Response(new Uint8Array(pdfBuffer) as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Prescription_${prescription.patient.name.replace(/\s+/g, "_")}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error("PDF Route Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
