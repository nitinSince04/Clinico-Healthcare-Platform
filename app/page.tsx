import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import {
  Stethoscope,
  Video,
  FileText,
  ShieldCheck,
  Star,
  ArrowRight,
  Heart,
  Brain,
  Baby,
  Activity,
  Award,
  Users,
  CalendarCheck,
  CheckCircle2,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch top 3 doctors from DB with try-catch fallback
  let topDoctors: any[] = [];
  try {
    topDoctors = await db.user.findMany({
      where: { role: "DOCTOR", doctorProfile: { status: "ACTIVE" } },
      include: { doctorProfile: true },
      take: 3,
    });
  } catch (error) {
    console.error("Failed to fetch top doctors:", error);
  }

  const specialties = [
    { name: "Cardiology", icon: Heart, count: "18+ Specialists", desc: "Heart health & cardiovascular care" },
    { name: "Dermatology", icon: Activity, count: "24+ Specialists", desc: "Skin, hair, & scalp therapy" },
    { name: "Pediatrics", icon: Baby, count: "15+ Specialists", desc: "Infant, child, & teen care" },
    { name: "Neurology", icon: Brain, count: "12+ Specialists", desc: "Brain & nervous system disorders" },
    { name: "Orthopedics", icon: Stethoscope, count: "20+ Specialists", desc: "Bone, joint, & spine therapy" },
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-24 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-sky-50/30 to-background pt-12 md:pt-20 pb-16 md:pb-24 border-b border-border/40">
        <div className="container px-4 md:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-4 py-1.5 text-xs font-semibold text-teal-800 shadow-sm backdrop-blur-sm">
                <ShieldCheck className="h-4 w-4 text-teal-600" />
                <span>Next-Gen Enterprise Telehealth Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Virtual Healthcare <br />
                <span className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
                  Reimagined for Everyone.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect with top-rated board-certified doctors in minutes. Experience HD video consultations, double-booking protected appointment scheduling, and instant PDF prescriptions.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/doctors">
                  <Button variant="gradient" size="lg" className="w-full sm:w-auto gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Book Consultation Now
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 border-slate-300">
                    Join as Doctor / Patient
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Live Metric Badges */}
              <div className="pt-8 grid grid-cols-3 gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">99.8%</p>
                  <p className="text-xs text-slate-500 font-medium">Patient Satisfaction</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">500+</p>
                  <p className="text-xs text-slate-500 font-medium">Verified Specialists</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">24/7</p>
                  <p className="text-xs text-slate-500 font-medium">Emergency Telehealth</p>
                </div>
              </div>
            </div>

            {/* Right Hero Graphic Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-4 rounded-3xl medical-gradient opacity-20 blur-2xl -z-10" />
              <Card className="glass-card border border-white/60 shadow-2xl p-6 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-100">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"
                      alt="Doctor Hero"
                      className="h-16 w-16 rounded-2xl object-cover ring-2 ring-teal-500/40"
                    />
                    <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-bold text-slate-900">4.9 (140+ reviews)</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">Dr. Sarah Smith</h3>
                    <p className="text-xs text-teal-600 font-semibold">Chief Cardiologist</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs bg-teal-50/70 p-4 rounded-xl border border-teal-100/60 mb-6">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Consultation Type:</span>
                    <Badge variant="secondary">HD Video Call</Badge>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Next Availability:</span>
                    <span className="font-bold text-emerald-700">Today, 02:30 PM</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Fee:</span>
                    <span className="font-extrabold text-slate-900">$150.00</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href="/doctors" className="w-full">
                    <Button variant="default" className="w-full gap-2 text-xs">
                      <CalendarCheck className="h-4 w-4" />
                      Instant Slot Reservation
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* SPECIALTIES GRID */}
      <section className="container px-4 md:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            Comprehensive Medical Care
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Explore Medical Specialties
          </h2>
          <p className="text-sm text-slate-600">
            Select a specialty to consult with certified medical experts available for virtual or in-person visits.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {specialties.map((spec) => {
            const IconComponent = spec.icon;
            return (
              <Link key={spec.name} href={`/doctors?specialty=${encodeURIComponent(spec.name)}`}>
                <Card className="h-full p-6 text-center hover:border-teal-500/50 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 group-hover:medical-gradient group-hover:text-white transition-colors shadow-sm">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">{spec.name}</h3>
                  <p className="text-xs text-teal-600 font-semibold mb-2">{spec.count}</p>
                  <p className="text-xs text-slate-500 leading-relaxed">{spec.desc}</p>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-slate-900 text-white py-16 md:py-24">
        <div className="container px-4 md:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <Badge variant="outline" className="text-teal-400 border-teal-500/40">
              Simple 3-Step Process
            </Badge>
            <h2 className="text-3xl font-black tracking-tight text-white">How Clinico Works</h2>
            <p className="text-sm text-slate-400">
              Get medical care from the comfort of your home in 3 easy steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400 text-lg font-bold border border-teal-500/30">
                01
              </div>
              <h3 className="text-xl font-bold text-white">Find Your Specialist</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Filter through verified profiles, compare consultation fees, read patient reviews, and pick your preferred time slot.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 text-lg font-bold border border-sky-500/30">
                02
              </div>
              <h3 className="text-xl font-bold text-white">Secure Video Call</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Join an encrypted HD video room at your appointment time directly from your browser. Upload medical history files seamlessly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative p-8 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 text-lg font-bold border border-indigo-500/30">
                03
              </div>
              <h3 className="text-xl font-bold text-white">Instant E-Prescription</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive digital prescriptions immediately post-consultation. Download formatted PDF prescriptions valid at any pharmacy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOP FEATURED DOCTORS */}
      <section className="container px-4 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Featured Specialists</h2>
            <p className="text-sm text-slate-600">Top-rated physicians ready for online consultations today.</p>
          </div>
          <Link href="/doctors">
            <Button variant="outline" className="gap-2">
              View All Doctors
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topDoctors.map((doc) => (
            <Card key={doc.id} className="overflow-hidden hover:shadow-xl transition-shadow border-slate-200">
              <div className="relative h-48 bg-slate-100">
                <img
                  src={doc.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400"}
                  alt={doc.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-white/90 text-slate-900 backdrop-blur-md border-0 shadow">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {doc.doctorProfile?.rating || 4.9}
                </Badge>
              </div>

              <CardContent className="p-6 space-y-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {doc.doctorProfile?.specialty}
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-900">{doc.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{doc.doctorProfile?.bio}</p>
                </div>

                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-slate-400 font-medium">Experience</p>
                    <p className="font-bold text-slate-800">{doc.doctorProfile?.experienceYears} Years</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">Fee</p>
                    <p className="font-extrabold text-teal-600 text-sm">${doc.doctorProfile?.consultationFee}</p>
                  </div>
                </div>

                <Link href={`/doctors/${doc.id}`}>
                  <Button variant="default" className="w-full text-xs">
                    Book Consultation
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* TRUST & COMPLIANCE BANNER */}
      <section className="container px-4 md:px-8">
        <div className="rounded-3xl medical-gradient p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <h2 className="text-2xl md:text-4xl font-extrabold">
                Enterprise Security & Clinical Compliance Built In
              </h2>
              <p className="text-sm md:text-base text-teal-100 leading-relaxed">
                Your medical history, prescriptions, and telehealth video sessions are protected with end-to-end 256-bit encryption and strict access controls.
              </p>
              <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-teal-300" /> HIPAA Compliant
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-teal-300" /> Instant PDF Generation
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                  <CheckCircle2 className="h-4 w-4 text-teal-300" /> Double-Booking Locked
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center lg:justify-end">
              <Link href="/register">
                <Button size="lg" className="bg-white text-teal-800 hover:bg-slate-100 font-bold px-8 shadow-xl">
                  Create Account Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
