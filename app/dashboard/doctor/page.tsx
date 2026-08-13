import { getAuthSession } from "@/lib/auth";
import { getDoctorAppointments } from "@/lib/actions/appointments";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DoctorDashboardClient } from "@/components/dashboard/doctor-dashboard-client";
import { Card } from "@/components/ui/card";
import { Stethoscope, Calendar, DollarSign, Users, Activity } from "lucide-react";

export default async function DoctorDashboardPage() {
  const session = await getAuthSession();
  if (!session || !session.user) {
    redirect("/login?callbackUrl=/dashboard/doctor");
  }

  const doctorUser = await db.user.findUnique({
    where: { id: session.user.id },
    include: { doctorProfile: true },
  });

  if (!doctorUser || !doctorUser.doctorProfile) {
    redirect("/login");
  }

  const { appointments } = await getDoctorAppointments(session.user.id);

  const completed = appointments.filter((a) => a.status === "COMPLETED");
  const totalEarnings = completed.length * (doctorUser.doctorProfile.consultationFee || 100);

  return (
    <div className="container px-4 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-xs font-bold text-teal-800 mb-2">
          <Activity className="h-3.5 w-3.5" /> Doctor Workspace
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Welcome back, {doctorUser.name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Specialty: <span className="font-bold text-slate-800">{doctorUser.doctorProfile.specialty}</span> • Consultation Fee: <span className="font-bold text-teal-600">${doctorUser.doctorProfile.consultationFee}</span>
        </p>
      </div>

      {/* Doctor Telemetry Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 bg-gradient-to-br from-teal-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Appointments</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{appointments.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-sky-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Completed Visits</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{completed.length}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-emerald-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Earnings</p>
              <p className="text-3xl font-black text-slate-900 mt-1">${totalEarnings}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-indigo-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Rating</p>
              <p className="text-3xl font-black text-slate-900 mt-1">{doctorUser.doctorProfile.rating}</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Stethoscope className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Doctor Dashboard Interactive Client Component */}
      <DoctorDashboardClient doctorUser={doctorUser} appointments={appointments} />
    </div>
  );
}
