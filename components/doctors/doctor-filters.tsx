"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, Filter, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function DoctorFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [selectedSpecialty, setSelectedSpecialty] = useState(searchParams.get("specialty") || "All");
  const [maxFee, setMaxFee] = useState(searchParams.get("maxFee") || "250");

  const specialties = [
    "All",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "General Medicine",
  ];

  const handleApplyFilters = (specialty?: string, fee?: string) => {
    const params = new URLSearchParams();
    const activeSpecialty = specialty !== undefined ? specialty : selectedSpecialty;
    const activeFee = fee !== undefined ? fee : maxFee;

    if (search) params.set("search", search);
    if (activeSpecialty && activeSpecialty !== "All") params.set("specialty", activeSpecialty);
    if (activeFee) params.set("maxFee", activeFee);

    router.push(`/doctors?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch("");
    setSelectedSpecialty("All");
    setMaxFee("250");
    router.push("/doctors");
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
        <Input
          type="text"
          placeholder="Search by doctor name, condition, or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
          className="pl-10"
        />
      </div>

      {/* Specialty Filter Pills */}
      <div>
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-3">
          Filter by Specialty
        </label>
        <div className="flex flex-wrap gap-2">
          {specialties.map((spec) => (
            <button
              key={spec}
              onClick={() => {
                setSelectedSpecialty(spec);
                handleApplyFilters(spec, maxFee);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSpecialty === spec
                  ? "medical-gradient text-white shadow-md"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Fee Slider & Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">
            Max Fee: ${maxFee}
          </span>
          <input
            type="range"
            min="50"
            max="300"
            step="10"
            value={maxFee}
            onChange={(e) => {
              setMaxFee(e.target.value);
              handleApplyFilters(selectedSpecialty, e.target.value);
            }}
            className="w-full accent-teal-600 cursor-pointer max-w-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Reset
          </Button>
          <Button variant="default" size="sm" onClick={() => handleApplyFilters()} className="gap-1 text-xs">
            <Filter className="h-3.5 w-3.5" /> Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
