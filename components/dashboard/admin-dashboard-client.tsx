"use client";

import { useState } from "react";
import { createDoctorByAdmin, deleteDoctorByAdmin } from "@/lib/actions/doctors";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Stethoscope, CheckCircle2, AlertCircle, Loader2, Trash2, UserX, ShieldAlert } from "lucide-react";
import Image from "next/image";

interface AdminDashboardClientProps {
  recentAppointments: any[];
  doctors: any[];
}

export function AdminDashboardClient({ recentAppointments, doctors }: AdminDashboardClientProps) {
  const [isOnboardModalOpen, setIsOnboardModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<any | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "password123",
    specialty: "Cardiology",
    experienceYears: "10",
    consultationFee: "150",
    location: "Clinico Main Tower, Suite 500",
    bio: "Experienced board-certified physician committed to telehealth excellence.",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    const res = await createDoctorByAdmin({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      specialty: formData.specialty,
      experienceYears: Number(formData.experienceYears),
      consultationFee: Number(formData.consultationFee),
      location: formData.location,
      bio: formData.bio,
    });

    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Failed to onboard doctor.");
    } else {
      setSuccessMsg(`Doctor "${formData.name}" onboarded successfully!`);
      setTimeout(() => {
        setIsOnboardModalOpen(false);
        setSuccessMsg(null);
      }, 1500);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!doctorToDelete) return;
    setIsDeleting(true);
    setDeleteError(null);

    const res = await deleteDoctorByAdmin(doctorToDelete.id);
    setIsDeleting(false);

    if (!res.success) {
      setDeleteError(res.error || "Failed to delete doctor.");
    } else {
      setSuccessMsg(res.message || `Doctor "${doctorToDelete.name}" removed successfully.`);
      setDoctorToDelete(null);
      setTimeout(() => {
        setSuccessMsg(null);
      }, 2500);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="text-xl font-black text-slate-900">System Telemetry & Doctor Directory</h3>
          <p className="text-xs text-slate-500">
            Platform-wide specialist controls, database management, and active consultations
          </p>
        </div>

        <Button
          variant="gradient"
          onClick={() => setIsOnboardModalOpen(true)}
          className="gap-2 text-xs font-bold shadow-md w-full sm:w-auto"
        >
          <UserPlus className="h-4 w-4" /> Onboard New Specialist
        </Button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* SPECIALISTS MANAGEMENT TABLE */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-teal-600" /> Active Specialist Directory ({doctors.length})
            </CardTitle>
            <p className="text-[11px] text-slate-500 font-medium">
              Manage existing medical specialists or permanently remove them from the Clinico platform.
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Specialist Doctor</th>
                  <th className="px-6 py-3">Specialty</th>
                  <th className="px-6 py-3">Experience / Fee</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Database Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400 font-medium">
                      No doctors currently registered in database.
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 font-bold overflow-hidden shrink-0 border border-teal-200">
                            {doc.image ? (
                              <img src={doc.image} alt={doc.name} className="h-full w-full object-cover" />
                            ) : (
                              doc.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{doc.name}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{doc.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                          {doc.doctorProfile?.specialty || "General"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        <div>{doc.doctorProfile?.experienceYears || 0} Yrs Experience</div>
                        <div className="text-[10px] text-emerald-600 font-bold">
                          ${doc.doctorProfile?.consultationFee || 100} / consultation
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={doc.doctorProfile?.status === "ACTIVE" ? "success" : "danger"}>
                          {doc.doctorProfile?.status || "ACTIVE"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDoctorToDelete(doc)}
                          className="h-8 gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete Doctor
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* RECENT APPOINTMENTS TABLE */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b border-slate-100 py-4">
          <CardTitle className="text-base font-bold text-slate-900">Recent Platform Appointments</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3">Patient</th>
                  <th className="px-6 py-3">Assigned Doctor</th>
                  <th className="px-6 py-3">Slot Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentAppointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-6 text-center text-slate-400">
                      No appointments recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4 font-bold text-slate-900">{appt.patient.name}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{appt.doctor.name}</div>
                        <div className="text-[10px] text-teal-600">{appt.doctor.doctorProfile?.specialty}</div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {new Date(appt.date).toLocaleDateString()} ({appt.timeSlot})
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={appt.status === "COMPLETED" ? "success" : "secondary"}>
                          {appt.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 font-extrabold text-teal-600">
                        ${appt.doctor.doctorProfile?.consultationFee || 100}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* DELETE DOCTOR CONFIRMATION MODAL */}
      <Dialog
        isOpen={!!doctorToDelete}
        onClose={() => setDoctorToDelete(null)}
        title="Remove Specialist from Database"
        description="Permanently delete doctor profile and revoke system access."
      >
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-rose-700">
              <ShieldAlert className="h-5 w-5 shrink-0" />
              <span>Warning: Permanent Deletion</span>
            </div>
            <p>
              Are you sure you want to delete <strong className="font-extrabold">{doctorToDelete?.name}</strong> ({doctorToDelete?.email})?
            </p>
            <p className="text-[11px] text-rose-600">
              This action cannot be undone. All associated doctor profile data and schedule slots will be permanently erased.
            </p>
          </div>

          {deleteError && (
            <div className="p-3 rounded-xl bg-rose-100 border border-rose-300 text-xs font-semibold text-rose-800 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{deleteError}</span>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full text-xs font-bold"
              onClick={() => setDoctorToDelete(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="w-full text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white gap-2"
              onClick={handleDeleteDoctor}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing...
                </>
              ) : (
                <>
                  <UserX className="h-4 w-4" />
                  Confirm Removal
                </>
              )}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* DOCTOR ONBOARDING MODAL */}
      <Dialog
        isOpen={isOnboardModalOpen}
        onClose={() => setIsOnboardModalOpen(false)}
        title="Onboard Healthcare Specialist"
        description="Register a new verified doctor into the Clinico Telehealth Directory."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Doctor Name</label>
              <Input name="name" placeholder="Dr. Alex Rivera" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Email Address</label>
              <Input type="email" name="email" placeholder="alex@clinico.com" value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Specialty</label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                className="w-full h-11 rounded-xl border border-input px-3 text-xs bg-background"
              >
                <option value="Cardiology">Cardiology</option>
                <option value="Dermatology">Dermatology</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="General Medicine">General Medicine</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Experience (Yrs)</label>
              <Input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleChange} />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">Consultation Fee ($)</label>
              <Input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-700">Bio & Qualifications</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className="w-full rounded-xl border border-input p-3 text-xs focus:ring-2 focus:ring-primary min-h-[60px]"
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full text-xs font-bold" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Onboarding Specialist...
              </>
            ) : (
              "Confirm & Onboard Doctor"
            )}
          </Button>
        </form>
      </Dialog>
    </div>
  );
}

