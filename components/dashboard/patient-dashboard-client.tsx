"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { updateAppointmentStatus } from "@/lib/actions/appointments";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog } from "@/components/ui/dialog";
import {
  Calendar,
  Clock,
  Video,
  FileText,
  UploadCloud,
  XCircle,
  Stethoscope,
  CheckCircle2,
  Download,
  AlertCircle,
  CreditCard,
  Sparkles,
  Bot,
} from "lucide-react";
import { AiChatbotWidget } from "@/components/dashboard/ai-chatbot";

export function PatientDashboardClient({
  upcomingAppointments,
  historyAppointments,
}: {
  upcomingAppointments: any[];
  historyAppointments: any[];
}) {
  const [activeTab, setActiveTab] = useState<"UPCOMING" | "HISTORY" | "AI_CHAT">("UPCOMING");
  const [isReportDrawerOpen, setIsReportDrawerOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoAppt, setActiveVideoAppt] = useState<any>(null);

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleCancel = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      await updateAppointmentStatus(id, "CANCELLED");
    }
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setUploadedFiles([...uploadedFiles, fileName]);
      setUploadMsg(`File "${fileName}" uploaded successfully to diagnostic record repository.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setActiveTab("UPCOMING")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "UPCOMING"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Upcoming Visits ({upcomingAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("HISTORY")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "HISTORY"
                ? "bg-white text-teal-700 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Historical Visits ({historyAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab("AI_CHAT")}
            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              activeTab === "AI_CHAT"
                ? "medical-gradient text-white shadow-sm"
                : "text-teal-700 hover:bg-teal-50"
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI Health Triage
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsReportDrawerOpen(true)}
          className="gap-2 text-xs w-full sm:w-auto border-teal-200 text-teal-700 hover:bg-teal-50"
        >
          <UploadCloud className="h-4 w-4" /> Upload Diagnostic Report
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === "AI_CHAT" ? (
        <AiChatbotWidget />
      ) : activeTab === "UPCOMING" ? (
        <div className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card className="p-12 text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
                <Calendar className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No Upcoming Appointments</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You don't have any scheduled appointments. Browse available doctors to book your virtual consultation.
              </p>
              <Link href="/doctors" className="inline-block pt-2">
                <Button variant="default" size="sm">
                  Find Doctors
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingAppointments.map((appt) => (
                <Card key={appt.id} className="p-6 space-y-4 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          appt.doctor.image ||
                          "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
                        }
                        alt={appt.doctor.name}
                        className="h-12 w-12 rounded-2xl object-cover ring-2 ring-teal-500/20"
                      />
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{appt.doctor.name}</h4>
                        <p className="text-xs text-teal-600 font-semibold">
                          {appt.doctor.doctorProfile?.specialty || "Specialist"}
                        </p>
                      </div>
                    </div>

                    <Badge variant={appt.status === "CONFIRMED" ? "success" : "warning"}>
                      {appt.status}
                    </Badge>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1.5 border border-slate-100">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar className="h-3.5 w-3.5 text-teal-600" /> Date:
                      </span>
                      <span className="font-bold">{format(new Date(appt.date), "EEE, MMM d, yyyy")}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="h-3.5 w-3.5 text-sky-600" /> Time Slot:
                      </span>
                      <span className="font-bold text-teal-700">{appt.timeSlot}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-medium">Type & Payment:</span>
                      <div className="flex items-center gap-1.5">
                        <Badge variant="secondary">{appt.type}</Badge>
                        <Badge variant={appt.paymentStatus === "PAID" ? "success" : "warning"} className="gap-1 text-[10px]">
                          <CreditCard className="h-3 w-3" /> {appt.paymentStatus === "PAID" ? "Stripe Paid" : "Unpaid"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    {appt.type === "VIDEO" && (
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => {
                          setActiveVideoAppt(appt);
                          setIsVideoModalOpen(true);
                        }}
                        className="w-full gap-2 text-xs font-bold"
                      >
                        <Video className="h-4 w-4" /> Enter Virtual Telehealth Room
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(appt.id)}
                      className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                    >
                      <XCircle className="h-4 w-4" /> Cancel
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {historyAppointments.length === 0 ? (
            <Card className="p-12 text-center">
              <p className="text-xs text-slate-500">No past visits recorded.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {historyAppointments.map((appt) => (
                <Card key={appt.id} className="p-6 space-y-4 border-slate-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-slate-900">{appt.doctor.name}</h4>
                      <p className="text-xs text-slate-500">{appt.doctor.doctorProfile?.specialty}</p>
                    </div>
                    <Badge variant={appt.status === "COMPLETED" ? "secondary" : "danger"}>
                      {appt.status}
                    </Badge>
                  </div>

                  <div className="text-xs text-slate-600 space-y-1">
                    <p>Visited on: <span className="font-bold">{format(new Date(appt.date), "MMM d, yyyy")}</span> at {appt.timeSlot}</p>
                    {appt.notes && <p className="text-slate-500 italic">Notes: "{appt.notes}"</p>}
                  </div>

                  {appt.prescription ? (
                    <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-teal-900">Diagnosis: {appt.prescription.diagnosis}</span>
                        <Badge variant="success" className="text-[10px]">PDF Issued</Badge>
                      </div>
                      <a
                        href={`/api/prescriptions/${appt.prescription.id}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button variant="default" size="sm" className="w-full gap-2 text-xs font-bold mt-1">
                          <Download className="h-3.5 w-3.5" /> Instant PDF Prescription Download
                        </Button>
                      </a>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-400">No digital prescription attached for this visit.</p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* DIAGNOSTIC REPORT UPLOAD DRAWER MODAL */}
      <Dialog
        isOpen={isReportDrawerOpen}
        onClose={() => setIsReportDrawerOpen(false)}
        title="Upload Diagnostic Record / Medical Lab File"
        description="Share medical records with your consulting doctor securely."
      >
        <div className="space-y-4">
          <div className="border-2 border-dashed border-teal-300 rounded-2xl p-8 text-center bg-teal-50/40 space-y-3">
            <UploadCloud className="h-10 w-10 text-teal-600 mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-800">Drag & drop files or click to browse</p>
              <p className="text-[11px] text-slate-400">Supports PDF, PNG, JPG (Max 25MB)</p>
            </div>
            <input
              type="file"
              onChange={handleSimulateFileUpload}
              className="text-xs cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-600 file:text-white hover:file:bg-teal-700"
            />
          </div>

          {uploadMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{uploadMsg}</span>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-700">Uploaded Records:</p>
              <ul className="space-y-1 text-xs">
                {uploadedFiles.map((file, idx) => (
                  <li key={idx} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg text-slate-800 font-mono">
                    <FileText className="h-4 w-4 text-teal-600" />
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <Button onClick={() => setIsReportDrawerOpen(false)} variant="gradient" className="w-full text-xs font-bold">
            Done / Close Drawer
          </Button>
        </div>
      </Dialog>

      {/* TELEHEALTH VIDEO ROOM STUB MODAL */}
      <Dialog
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        title="Clinico Encrypted Telehealth Video Room"
        description={`Live Consultation with ${activeVideoAppt?.doctor?.name}`}
      >
        <div className="space-y-4">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center border border-slate-800">
            <div className="text-center text-white space-y-2">
              <Video className="h-12 w-12 text-teal-400 mx-auto animate-pulse" />
              <p className="text-sm font-bold">Connecting to Encrypted Peer-to-Peer Stream...</p>
              <p className="text-xs text-slate-400">Doctor: {activeVideoAppt?.doctor?.name}</p>
            </div>
            <div className="absolute top-3 left-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              HD 1080p Live Stream Connected
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="destructive" onClick={() => setIsVideoModalOpen(false)} className="w-full text-xs font-bold">
              Leave Call Room
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
