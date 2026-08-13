"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getAuthSession } from "@/lib/auth";
import { doctorOnboardingSchema, DoctorOnboardingInput, scheduleUpdateSchema, ScheduleUpdateInput } from "@/lib/validations/doctor";
import { revalidatePath } from "next/cache";

export async function getDoctors(filters?: { specialty?: string; search?: string; minFee?: number; maxFee?: number }) {
  try {
    const whereClause: any = {
      role: "DOCTOR",
      doctorProfile: {
        status: "ACTIVE",
      },
    };

    if (filters?.specialty && filters.specialty !== "All") {
      whereClause.doctorProfile.specialty = filters.specialty;
    }

    if (filters?.search) {
      whereClause.OR = [
        { name: { contains: filters.search } },
        { doctorProfile: { specialty: { contains: filters.search } } },
        { doctorProfile: { bio: { contains: filters.search } } },
      ];
    }

    if (filters?.minFee !== undefined || filters?.maxFee !== undefined) {
      whereClause.doctorProfile.consultationFee = {
        gte: filters?.minFee || 0,
        lte: filters?.maxFee || 1000,
      };
    }

    const doctors = await db.user.findMany({
      where: whereClause,
      include: {
        doctorProfile: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, doctors };
  } catch (error: any) {
    console.error("Get Doctors Error:", error);
    return { success: false, doctors: [], error: error.message };
  }
}

export async function getDoctorById(id: string) {
  try {
    const doctor = await db.user.findFirst({
      where: { id, role: "DOCTOR" },
      include: { doctorProfile: true },
    });

    if (!doctor || !doctor.doctorProfile) {
      return { success: false, error: "Doctor profile not found." };
    }

    return { success: true, doctor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDoctorSchedule(userId: string, input: ScheduleUpdateInput) {
  try {
    const session = await getAuthSession();
    if (!session || (session.user.id !== userId && session.user.role !== "ADMIN")) {
      return { success: false, error: "Unauthorized schedule update." };
    }

    const validated = scheduleUpdateSchema.parse(input);

    const updatedProfile = await db.doctorProfile.update({
      where: { userId },
      data: {
        availableSlots: JSON.stringify(validated.availableSlots),
        ...(validated.status && { status: validated.status }),
      },
    });

    revalidatePath("/dashboard/doctor");
    revalidatePath(`/doctors/${userId}`);

    return { success: true, profile: updatedProfile };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDoctorByAdmin(input: DoctorOnboardingInput) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Admin access required." };
    }

    const validated = doctorOnboardingSchema.parse(input);

    const existingUser = await db.user.findUnique({
      where: { email: validated.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "A user with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validated.password, 10);

    const newDoctor = await db.user.create({
      data: {
        name: validated.name,
        email: validated.email.toLowerCase(),
        password: hashedPassword,
        role: "DOCTOR",
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(validated.name)}`,
        doctorProfile: {
          create: {
            specialty: validated.specialty,
            bio: validated.bio,
            experienceYears: validated.experienceYears,
            consultationFee: validated.consultationFee,
            availableSlots: JSON.stringify(["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM", "04:30 PM"]),
            location: validated.location || "Clinico Telehealth Main Hub",
            status: "ACTIVE",
          },
        },
      },
      include: { doctorProfile: true },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/doctors");

    return { success: true, doctor: newDoctor };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAdminMetrics() {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized" };
    }

    const totalDoctors = await db.user.count({ where: { role: "DOCTOR" } });
    const totalPatients = await db.user.count({ where: { role: "PATIENT" } });
    const totalAppointments = await db.appointment.count();
    const completedAppointments = await db.appointment.findMany({
      where: { status: "COMPLETED" },
      include: { doctor: { include: { doctorProfile: true } } },
    });

    const totalRevenue = completedAppointments.reduce((acc, appt) => {
      const fee = appt.doctor.doctorProfile?.consultationFee || 100;
      return acc + fee;
    }, 0);

    const recentAppointments = await db.appointment.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        patient: true,
        doctor: { include: { doctorProfile: true } },
      },
    });

    const doctors = await db.user.findMany({
      where: { role: "DOCTOR" },
      include: { doctorProfile: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      metrics: {
        totalDoctors,
        totalPatients,
        totalAppointments,
        totalRevenue,
      },
      recentAppointments,
      doctors,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDoctorByAdmin(doctorId: string) {
  try {
    const session = await getAuthSession();
    if (!session || session.user.role !== "ADMIN") {
      return { success: false, error: "Admin authorization required." };
    }

    const doctor = await db.user.findFirst({
      where: { id: doctorId, role: "DOCTOR" },
    });

    if (!doctor) {
      return { success: false, error: "Doctor not found or invalid doctor ID." };
    }

    // Delete user record (Prisma onDelete: Cascade handles profile, appointments, prescriptions)
    await db.user.delete({
      where: { id: doctorId },
    });

    revalidatePath("/dashboard/admin");
    revalidatePath("/doctors");
    revalidatePath("/dashboard/patient");

    return { success: true, message: `Doctor "${doctor.name}" has been permanently removed.` };
  } catch (error: any) {
    console.error("Delete Doctor Error:", error);
    return { success: false, error: error.message || "Failed to remove doctor." };
  }
}

