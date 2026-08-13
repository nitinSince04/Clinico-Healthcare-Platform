import { getAuthSession } from "@/lib/auth";
import { getAdminMetrics } from "@/lib/actions/doctors";
import { redirect } from "next/navigation";
import { AdminDashboardClient } from "@/components/dashboard/admin-dashboard-client";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Stethoscope, Users, Calendar, DollarSign } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await getAuthSession();
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const { metrics, recentAppointments, doctors } = await getAdminMetrics();

  return (
    <div className="container px-4 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-800 mb-2">
          <ShieldCheck className="h-3.5 w-3.5" /> Platform Executive Admin
        </div>
        <h1 className="text-3xl font-black text-slate-900">
          Executive Control Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Monitor system health, manage onboarding, and review live revenue metrics.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 bg-gradient-to-br from-emerald-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Revenue Generated</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                ${metrics?.totalRevenue || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-teal-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Active Specialists</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {metrics?.totalDoctors || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
              <Stethoscope className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-sky-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Registered Patients</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {metrics?.totalPatients || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
              <Users className="h-6 w-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200 bg-gradient-to-br from-indigo-500/10 via-background to-background">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500 font-semibold">Total Consultations</p>
              <p className="text-3xl font-black text-slate-900 mt-1">
                {metrics?.totalAppointments || 0}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-700">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Interactive Admin Client Component */}
      <AdminDashboardClient recentAppointments={recentAppointments || []} doctors={doctors || []} />
    </div>
  );
}

