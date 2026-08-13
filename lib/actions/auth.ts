"use me";
"use server";

import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";

export async function registerUser(input: RegisterInput) {
  try {
    const validatedData = registerSchema.parse(input);

    const existingUser = await db.user.findUnique({
      where: { email: validatedData.email.toLowerCase() },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists." };
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10);

    const newUser = await db.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email.toLowerCase(),
        password: hashedPassword,
        role: validatedData.role,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(validatedData.name)}`,
      },
    });

    if (validatedData.role === "PATIENT") {
      await db.patientProfile.create({
        data: {
          userId: newUser.id,
          age: validatedData.age || 30,
          gender: validatedData.gender || "Other",
          bloodGroup: validatedData.bloodGroup || "O+",
          medicalHistory: validatedData.medicalHistory || "None reported.",
        },
      });
    } else if (validatedData.role === "DOCTOR") {
      await db.doctorProfile.create({
        data: {
          userId: newUser.id,
          specialty: validatedData.specialty || "General Medicine",
          bio: validatedData.bio || "Dedicated healthcare professional.",
          experienceYears: validatedData.experienceYears || 5,
          consultationFee: validatedData.consultationFee || 100,
          availableSlots: JSON.stringify(["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM"]),
          status: "ACTIVE",
        },
      });
    }

    return { success: true, userId: newUser.id };
  } catch (error: any) {
    console.error("Register Error:", error);
    return { success: false, error: error.message || "Failed to register user." };
  }
}
