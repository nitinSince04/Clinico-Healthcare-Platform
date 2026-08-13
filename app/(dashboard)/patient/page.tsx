import { getAuthSession } from "@/lib/auth";
import { getPatientAppointments } from "@/lib/actions/appointments";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PatientDashboardClient } from "@/components/dashboard/patient-dashboard-client";
import {
  Calendar,
  Clock,
  FileText,
  Video,
  Plus,
  Activity,
  CheckCircle2,
  Stethoscope,
  UploadCloud,
} from "lucide-react";

export default async function PatientDashboardPage() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    redirect("/login");
  }

  const { appointments } = await getPatientAppointments(session.user.id);

  const upcomingAppointments = appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED");
  const historyAppointments = appointments.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED");

  return (
    <div className="container px-4 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 mb-2">
            <Activity className="h-3.5 w-3.5" /> Patient Portal
          </div>
          <h1 className="text-3xl font-black text-slate-900">
            Welcome back, {session.user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage your upcoming virtual visits, download digital prescriptions, and view diagnostic medical files.
          </p>
        </div>

        <Link href="/doctors">
          <Button variant="gradient" className="gap-2 text-xs font-bold shadow-md">
            <Plus className="h-4 w-4" /> Book New Consultation
          </Button>
        </Link>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 bg-gradient-to-br from-teal-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Upcoming Visits</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{upcomingAppointments.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-sky-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Completed Consultations</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{historyAppointments.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-indigo-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Prescriptions Issued</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {appointments.filter((a) => a.prescription).length}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <FileText className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-teal-200 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-teal-700 font-bold">AI Health Assistant</p>
              <p className="text-sm font-black text-slate-900 mt-1">Ready 24/7</p>
              <p className="text-[10px] text-teal-600 font-medium">Smart Triage</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
              <Activity className="h-6 w-6 animate-pulse" />
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Patient Tabbed Dashboard Client Component */}
      <PatientDashboardClient
        upcomingAppointments={upcomingAppointments}
        historyAppointments={historyAppointments}
      />
    </div>
  );
}
