import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  const isAdminDashboard = pathname.startsWith("/dashboard/admin") || pathname === "/admin";
  const isDoctorDashboard = pathname.startsWith("/dashboard/doctor") || pathname === "/doctor";
  const isPatientDashboard = pathname.startsWith("/dashboard/patient") || pathname === "/patient";

  if (isAuthPage) {
    if (token) {
      const role = token.role;
      if (role === "ADMIN") return NextResponse.redirect(new URL("/dashboard/admin", req.url));
      if (role === "DOCTOR") return NextResponse.redirect(new URL("/dashboard/doctor", req.url));
      return NextResponse.redirect(new URL("/dashboard/patient", req.url));
    }
    return NextResponse.next();
  }

  // Protect Admin Dashboard
  if (isAdminDashboard) {
    if (!token) return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect Doctor Dashboard
  if (isDoctorDashboard) {
    if (!token) return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
    if (token.role !== "DOCTOR" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Protect Patient Dashboard
  if (isPatientDashboard) {
    if (!token) return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req.url));
    if (token.role !== "PATIENT" && token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/patient",
    "/doctor",
    "/admin",
    "/login",
    "/register",
  ],
};
