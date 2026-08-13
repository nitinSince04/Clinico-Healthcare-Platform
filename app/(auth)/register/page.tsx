"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Activity, Stethoscope, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"PATIENT" | "DOCTOR">("PATIENT");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    // Patient
    age: "30",
    gender: "Male",
    bloodGroup: "O+",
    medicalHistory: "",
    // Doctor
    specialty: "General Medicine",
    experienceYears: "5",
    consultationFee: "100",
    bio: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        age: Number(formData.age),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        medicalHistory: formData.medicalHistory,
        specialty: formData.specialty,
        experienceYears: Number(formData.experienceYears),
        consultationFee: Number(formData.consultationFee),
        bio: formData.bio,
      });

      if (!res.success) {
        setError(res.error || "Registration failed.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12 px-4">
      <Card className="w-full max-w-lg shadow-2xl border-slate-200">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl medical-gradient text-white shadow-md">
            <Activity className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-black text-slate-900">Create Clinico Account</CardTitle>
          <CardDescription className="text-xs">
            Join Clinico as a Patient or Healthcare Provider
          </CardDescription>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl mt-4">
            <button
              type="button"
              onClick={() => setRole("PATIENT")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "PATIENT"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <User className="h-4 w-4" /> Patient Account
            </button>
            <button
              type="button"
              onClick={() => setRole("DOCTOR")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
                role === "DOCTOR"
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Stethoscope className="h-4 w-4" /> Doctor Account
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>Account created successfully! Redirecting to login...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Full Name</label>
                <Input
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <Input
                type="password"
                name="password"
                placeholder="At least 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Dynamic Role Specific Inputs */}
            {role === "PATIENT" ? (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Patient Details</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Age</label>
                    <Input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Blood Group</label>
                    <Input
                      name="bloodGroup"
                      placeholder="O+"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Medical History Summary</label>
                  <textarea
                    name="medicalHistory"
                    placeholder="Known allergies, existing conditions..."
                    value={formData.medicalHistory}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:ring-2 focus:ring-primary min-h-[70px]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-900">Doctor Professional Profile</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Specialty</label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full h-11 rounded-xl border border-input bg-background px-3 text-xs"
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
                    <label className="text-[11px] font-semibold text-slate-600">Experience (Yrs)</label>
                    <Input
                      type="number"
                      name="experienceYears"
                      value={formData.experienceYears}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Fee ($)</label>
                    <Input
                      type="number"
                      name="consultationFee"
                      value={formData.consultationFee}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Bio & Credentials</label>
                  <textarea
                    name="bio"
                    placeholder="Briefly describe your clinical background, qualifications..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-input bg-background p-3 text-xs focus:ring-2 focus:ring-primary min-h-[70px]"
                  />
                </div>
              </div>
            )}

            <Button type="submit" variant="gradient" className="w-full mt-4" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                `Complete Registration (${role})`
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center border-t border-slate-100 py-4 text-xs text-slate-500">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-teal-600 hover:underline ml-1">
            Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
