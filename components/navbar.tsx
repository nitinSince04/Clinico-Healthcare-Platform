"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Activity, User, LogOut, LayoutDashboard, Calendar, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!session?.user?.role) return "/dashboard/patient";
    if (session.user.role === "ADMIN") return "/dashboard/admin";
    if (session.user.role === "DOCTOR") return "/dashboard/doctor";
    return "/dashboard/patient";
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl medical-gradient text-white shadow-md transition-transform group-hover:scale-105">
            <Activity className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Clinico
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/doctors" className="hover:text-primary transition-colors flex items-center gap-1.5">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            Find Doctors
          </Link>
          <Link href="/#features" className="hover:text-primary transition-colors">
            Platform Features
          </Link>
          <Link href="/#about" className="hover:text-primary transition-colors">
            About Us
          </Link>
        </nav>

        {/* Auth / Profile Actions */}
        <div className="flex items-center gap-3">
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full border border-border p-1.5 pr-3 hover:bg-accent/10 transition-colors"
              >
                <img
                  src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.name}`}
                  alt={session.user.name || "User Avatar"}
                  className="h-8 w-8 rounded-full object-cover border border-teal-500/30"
                />
                <span className="hidden sm:inline text-xs font-semibold text-foreground">
                  {session.user.name}
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                  {session.user.role}
                </span>
              </button>

              {dropdownOpen && (
                <div
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-background p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-2"
                >
                  <div className="px-3 py-2 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{session.user.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{session.user.email}</p>
                  </div>

                  <Link
                    href={getDashboardLink()}
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4 text-teal-600" />
                    Dashboard ({session.user.role})
                  </Link>

                  {session.user.role === "PATIENT" && (
                    <Link
                      href="/doctors"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Calendar className="h-4 w-4 text-sky-600" />
                      Book Consultation
                    </Link>
                  )}

                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors mt-1 border-t border-border pt-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="gradient" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
