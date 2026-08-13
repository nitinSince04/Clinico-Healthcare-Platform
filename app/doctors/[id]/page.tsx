import { notFound } from "next/navigation";
import { getDoctorById } from "@/lib/actions/doctors";
import { SlotPicker } from "@/components/booking/slot-picker";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, Award, ShieldCheck, CheckCircle2 } from "lucide-react";

export default async function DoctorDetailPage({ params }: { params: { id: string } }) {
  const { doctor, error } = await getDoctorById(params.id);

  if (error || !doctor || !doctor.doctorProfile) {
    notFound();
  }

  const profile = doctor.doctorProfile;

  return (
    <div className="container px-4 md:px-8 py-10 space-y-10">
      {/* Top Banner Profile Overview */}
      <Card className="overflow-hidden border-slate-200 shadow-lg">
        <div className="medical-gradient h-32 md:h-44 relative opacity-90" />
        <CardContent className="p-6 md:p-8 relative -mt-16 md:-mt-20">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              <img
                src={doctor.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                alt={doctor.name}
                className="h-32 w-32 rounded-3xl object-cover ring-4 ring-white shadow-xl bg-white"
              />
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="secondary" className="text-xs font-bold px-3 py-1">
                    {profile.specialty}
                  </Badge>
                  <Badge className="bg-amber-100 text-amber-800 font-bold border-amber-300">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                    {profile.rating} Rating
                  </Badge>
                  <Badge variant="success" className="gap-1">
                    <ShieldCheck className="h-3 w-3" /> Board Certified
                  </Badge>
                </div>

                <h1 className="text-3xl font-black text-slate-900">{doctor.name}</h1>

                <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
                  <MapPin className="h-3.5 w-3.5 text-sky-600" />
                  {profile.location}
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center md:text-right w-full md:w-auto">
              <p className="text-xs text-slate-400 font-medium">Consultation Fee</p>
              <p className="text-3xl font-black text-teal-600">${profile.consultationFee}</p>
              <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">● Slots Open Today</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Bio & Qualifications */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              About Doctor
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">{profile.bio}</p>

            <div className="grid grid-cols-2 gap-4 pt-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-medium">Experience</p>
                <p className="text-base font-extrabold text-slate-900 mt-1">
                  {profile.experienceYears}+ Years
                </p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-medium">Status</p>
                <p className="text-base font-extrabold text-emerald-600 mt-1">Active Practitioner</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Clinical Specialties</h3>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>Primary Care & Telehealth Consultations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>E-Prescription & Diagnostic Review</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
                <span>Preventive Medical Wellness Strategy</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right 7-Day Interactive Slot Booking Engine */}
        <div className="lg:col-span-7">
          <SlotPicker
            doctorId={doctor.id}
            doctorName={doctor.name}
            consultationFee={profile.consultationFee}
            availableSlotsJson={profile.availableSlots}
          />
        </div>
      </div>
    </div>
  );
}
