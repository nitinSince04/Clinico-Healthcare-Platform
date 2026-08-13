import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

function createRedirect(path: string, req: NextRequest) {
  const baseUrl = req.nextUrl?.origin || process.env.NEXTAUTH_URL || "http://localhost:3000";
  try {
    return NextResponse.redirect(new URL(path, baseUrl));
  } catch (err) {
    return NextResponse.redirect(new URL(path, "http://localhost:3000"));
  }
}

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
      if (role === "ADMIN") return createRedirect("/dashboard/admin", req);
      if (role === "DOCTOR") return createRedirect("/dashboard/doctor", req);
      return createRedirect("/dashboard/patient", req);
    }
    return NextResponse.next();
  }

  // Protect Admin Dashboard
  if (isAdminDashboard) {
    if (!token) return createRedirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req);
    if (token.role !== "ADMIN") {
      return createRedirect("/login", req);
    }
  }

  // Protect Doctor Dashboard
  if (isDoctorDashboard) {
    if (!token) return createRedirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req);
    if (token.role !== "DOCTOR" && token.role !== "ADMIN") {
      return createRedirect("/login", req);
    }
  }

  // Protect Patient Dashboard
  if (isPatientDashboard) {
    if (!token) return createRedirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`, req);
    if (token.role !== "PATIENT" && token.role !== "ADMIN") {
      return createRedirect("/login", req);
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
