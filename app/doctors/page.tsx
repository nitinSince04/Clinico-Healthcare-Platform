import { Suspense } from "react";
import Link from "next/link";
import { getDoctors } from "@/lib/actions/doctors";
import { DoctorFilters } from "@/components/doctors/doctor-filters";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Calendar, Award, Stethoscope, Loader2 } from "lucide-react";

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: { specialty?: string; search?: string; maxFee?: string };
}) {
  const specialty = searchParams.specialty;
  const search = searchParams.search;
  const maxFee = searchParams.maxFee ? Number(searchParams.maxFee) : undefined;

  const { doctors } = await getDoctors({ specialty, search, maxFee });

  return (
    <div className="container px-4 md:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Find Board-Certified Specialists
        </h1>
        <p className="text-sm text-slate-600">
          Book telehealth video consultations or in-person clinic visits with top medical providers.
        </p>
      </div>

      {/* Filter Toolbar wrapped in Suspense */}
      <Suspense fallback={
        <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-teal-600" />
        </div>
      }>
        <DoctorFilters />
      </Suspense>

      {/* Doctor Cards Grid */}
      <div className="space-y-4">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Showing {doctors.length} Available Doctors
        </p>

        {doctors.length === 0 ? (
          <Card className="p-12 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No doctors match your filter criteria</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your specialty choice or fee slider to see more available healthcare professionals.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <Card key={doc.id} className="overflow-hidden hover:shadow-xl transition-all border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="relative h-52 bg-slate-100">
                    <img
                      src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                      alt={doc.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-white/95 text-slate-900 font-bold backdrop-blur-md shadow-md border-0">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                      {doc.doctorProfile?.rating || 4.9}
                    </Badge>
                  </div>

                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="font-semibold text-xs">
                        {doc.doctorProfile?.specialty}
                      </Badge>
                      <span className="text-xs text-emerald-600 font-extrabold flex items-center gap-1">
                        ● Available Today
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {doc.doctorProfile?.bio}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-600 pt-2">
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-teal-600" />
                        {doc.doctorProfile?.experienceYears} Yrs Exp.
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="h-3.5 w-3.5 text-sky-600" />
                        {doc.doctorProfile?.location || "Main Hub"}
                      </span>
                    </div>
                  </CardContent>
                </div>

                <div className="p-6 pt-0 space-y-3">
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-slate-400 font-medium">Consultation Fee</span>
                    <span className="text-base font-extrabold text-teal-600">
                      ${doc.doctorProfile?.consultationFee}
                    </span>
                  </div>

                  <Link href={`/doctors/${doc.id}`} className="block w-full">
                    <Button variant="default" className="w-full gap-2 text-xs">
                      <Calendar className="h-4 w-4" /> View Profile & Book Slot
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
