"use client";

import { useState } from "react";
import { format } from "date-fns";
import { updateDoctorSchedule } from "@/lib/actions/doctors";
import { updateAppointmentStatus } from "@/lib/actions/appointments";
import { PrescriptionBuilder } from "@/components/prescription/prescription-builder";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  CheckCircle2,
  XCircle,
  Settings,
  UserCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

export function DoctorDashboardClient({
  doctorUser,
  appointments,
}: {
  doctorUser: any;
  appointments: any[];
}) {
  const profile = doctorUser.doctorProfile;
  let defaultSlots: string[] = ["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM"];
  try {
    if (profile?.availableSlots) defaultSlots = JSON.parse(profile.availableSlots);
  } catch (e) {}

  const allPossibleSlots = [
    "08:30 AM",
    "09:00 AM",
    "09:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "01:00 PM",
    "01:30 PM",
    "02:00 PM",
    "02:30 PM",
    "03:00 PM",
    "03:30 PM",
    "04:00 PM",
    "04:30 PM",
    "05:00 PM",
  ];

  const [activeSlots, setActiveSlots] = useState<string[]>(defaultSlots);
  const [status, setStatus] = useState<"ACTIVE" | "INACTIVE">(profile?.status || "ACTIVE");
  const [isScheduleSaved, setIsScheduleSaved] = useState(false);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);

  const [isRxModalOpen, setIsRxModalOpen] = useState(false);
  const [selectedApptForRx, setSelectedApptForRx] = useState<any>(null);

  const toggleSlot = (slot: string) => {
    if (activeSlots.includes(slot)) {
      setActiveSlots(activeSlots.filter((s) => s !== slot));
    } else {
      setActiveSlots([...activeSlots, slot]);
    }
  };

  const handleSaveSchedule = async () => {
    setIsSavingSchedule(true);
    const res = await updateDoctorSchedule(doctorUser.id, {
      availableSlots: activeSlots,
      status,
    });
    setIsSavingSchedule(false);
    if (res.success) {
      setIsScheduleSaved(true);
      setTimeout(() => setIsScheduleSaved(false), 2000);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: "CONFIRMED" | "CANCELLED" | "COMPLETED") => {
    await updateAppointmentStatus(id, newStatus);
  };

  return (
    <div className="space-y-8">
      {/* 1. Dynamic Schedule & Availability Modifier */}
      <Card className="p-6 border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Settings className="h-4 w-4 text-teal-600" />
              Dynamic Daily Working Hours & Availability
            </h3>
            <p className="text-xs text-slate-500">
              Select time slots open for patient booking. Changes take effect instantly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="h-9 rounded-xl border border-input px-3 text-xs bg-background font-bold"
            >
              <option value="ACTIVE">Status: ACTIVE</option>
              <option value="INACTIVE">Status: INACTIVE</option>
            </select>

            <Button
              variant="gradient"
              size="sm"
              onClick={handleSaveSchedule}
              disabled={isSavingSchedule}
              className="text-xs font-bold gap-1"
            >
              {isSavingSchedule ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              Save Schedule
            </Button>
          </div>
        </div>

        {isScheduleSaved && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800">
            ✅ Schedule configuration updated successfully!
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {allPossibleSlots.map((slot) => {
            const isSelected = activeSlots.includes(slot);
            return (
              <button
                key={slot}
                onClick={() => toggleSlot(slot)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? "medical-gradient text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {slot}
              </button>
            );
          })}
        </div>
      </Card>

      {/* 2. Appointments Workspace List */}
      <div className="space-y-4">
        <h3 className="text-xl font-black text-slate-900">
          Patient Appointment Requests ({appointments.length})
        </h3>

        {appointments.length === 0 ? (
          <Card className="p-12 text-center text-xs text-slate-500">
            No patient appointments scheduled yet.
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {appointments.map((appt) => (
              <Card key={appt.id} className="p-6 space-y-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        appt.patient.image ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${appt.patient.name}`
                      }
                      alt={appt.patient.name}
                      className="h-12 w-12 rounded-2xl object-cover ring-2 ring-sky-500/20"
                    />
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{appt.patient.name}</h4>
                      <p className="text-xs text-slate-500">
                        {appt.patient.patientProfile?.age} Yrs • {appt.patient.patientProfile?.gender} • Blood: {appt.patient.patientProfile?.bloodGroup || "O+"}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={
                      appt.status === "CONFIRMED"
                        ? "success"
                        : appt.status === "COMPLETED"
                        ? "secondary"
                        : "warning"
                    }
                  >
                    {appt.status}
                  </Badge>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 border border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Scheduled Date:</span>
                    <span className="font-bold text-slate-900">{format(new Date(appt.date), "EEE, MMM d, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Slot:</span>
                    <span className="font-bold text-teal-700">{appt.timeSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Visit Mode:</span>
                    <Badge variant="secondary">{appt.type}</Badge>
                  </div>
                  {appt.notes && (
                    <div className="pt-1 border-t border-slate-200 text-slate-600">
                      <span className="font-semibold text-slate-500">Patient Notes:</span> "{appt.notes}"
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  {appt.status !== "COMPLETED" && (
                    <Button
                      variant="gradient"
                      size="sm"
                      onClick={() => {
                        setSelectedApptForRx(appt);
                        setIsRxModalOpen(true);
                      }}
                      className="w-full sm:w-auto gap-1.5 text-xs font-bold"
                    >
                      <FileText className="h-4 w-4" /> Issue E-Prescription
                    </Button>
                  )}

                  {appt.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusUpdate(appt.id, "CONFIRMED")}
                      className="text-xs text-teal-700 border-teal-200"
                    >
                      Confirm
                    </Button>
                  )}

                  {appt.status !== "CANCELLED" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStatusUpdate(appt.id, "CANCELLED")}
                      className="text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* E-PRESCRIPTION FORM MODAL */}
      <Dialog
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        title="Interactive E-Prescription Builder"
        description={`Issue digital prescription for ${selectedApptForRx?.patient?.name}`}
      >
        {selectedApptForRx && (
          <PrescriptionBuilder
            appointment={selectedApptForRx}
            doctorName={doctorUser.name}
            doctorSpecialty={profile?.specialty || "Specialist"}
            onSuccess={() => {
              // Optionally refresh
            }}
          />
        )}
      </Dialog>
    </div>
  );
}
