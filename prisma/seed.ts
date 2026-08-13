import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Clinico Database Seed...");

  // Clean existing tables
  await prisma.prescription.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.patientProfile.deleteMany({});
  await prisma.doctorProfile.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Admin
  const admin = await prisma.user.create({
    data: {
      name: "Clinico Admin",
      email: "admin@clinico.com",
      password: hashedPassword,
      role: "ADMIN",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // 2. Create Doctors
  const doctorsData = [
    {
      name: "Dr. Sarah Smith",
      email: "doctor@clinico.com", // Main demo doctor email
      specialty: "Cardiology",
      bio: "Board-certified Cardiologist specializing in preventive heart health, hypertension management, and non-invasive imaging.",
      experienceYears: 14,
      consultationFee: 150,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400",
      availableSlots: JSON.stringify(["09:00 AM", "10:30 AM", "01:00 PM", "02:30 PM", "04:00 PM"]),
    },
    {
      name: "Dr. Michael Chen",
      email: "dr.chen@clinico.com",
      specialty: "Dermatology",
      bio: "Expert Dermatologist specializing in medical acne therapies, eczema, cosmetic skin care, and surgical mole evaluations.",
      experienceYears: 9,
      consultationFee: 120,
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
      availableSlots: JSON.stringify(["09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM"]),
    },
    {
      name: "Dr. Priya Patel",
      email: "dr.patel@clinico.com",
      specialty: "Pediatrics",
      bio: "Compassionate Pediatrician devoted to child growth monitoring, vaccinations, adolescent medicine, and wellness programs.",
      experienceYears: 16,
      consultationFee: 130,
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1594824813566-78a99478f72c?auto=format&fit=crop&q=80&w=400",
      availableSlots: JSON.stringify(["10:00 AM", "11:30 AM", "01:30 PM", "03:00 PM"]),
    },
    {
      name: "Dr. James Williams",
      email: "dr.williams@clinico.com",
      specialty: "Neurology",
      bio: "Senior Neurologist focusing on migraine management, neurodegenerative care, sleep disorders, and stroke rehabilitation.",
      experienceYears: 11,
      consultationFee: 180,
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
      availableSlots: JSON.stringify(["08:30 AM", "10:00 AM", "01:00 PM", "04:30 PM"]),
    },
    {
      name: "Dr. Elena Johnson",
      email: "dr.johnson@clinico.com",
      specialty: "Orthopedics",
      bio: "Orthopedic Surgeon expert in sports injury recovery, joint health, spine alignment, and regenerative therapies.",
      experienceYears: 10,
      consultationFee: 140,
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400",
      availableSlots: JSON.stringify(["09:00 AM", "11:00 AM", "02:30 PM", "04:00 PM"]),
    },
  ];

  const createdDoctors = [];

  for (const doc of doctorsData) {
    const doctorUser = await prisma.user.create({
      data: {
        name: doc.name,
        email: doc.email,
        password: hashedPassword,
        role: "DOCTOR",
        image: doc.image,
        doctorProfile: {
          create: {
            specialty: doc.specialty,
            bio: doc.bio,
            experienceYears: doc.experienceYears,
            consultationFee: doc.consultationFee,
            availableSlots: doc.availableSlots,
            rating: doc.rating,
            status: "ACTIVE",
          },
        },
      },
      include: {
        doctorProfile: true,
      },
    });
    createdDoctors.push(doctorUser);
    console.log(`✅ Doctor created: ${doc.name} (${doc.specialty})`);
  }

  // 3. Create Patients
  const patient1User = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "patient@clinico.com", // Main demo patient email
      password: hashedPassword,
      role: "PATIENT",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
      patientProfile: {
        create: {
          age: 34,
          gender: "Male",
          bloodGroup: "O+",
          medicalHistory: "Mild seasonal asthma, No known drug allergies.",
        },
      },
    },
    include: { patientProfile: true },
  });

  const patient2User = await prisma.user.create({
    data: {
      name: "Jane Smith",
      email: "jane.smith@clinico.com",
      password: hashedPassword,
      role: "PATIENT",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400",
      patientProfile: {
        create: {
          age: 29,
          gender: "Female",
          bloodGroup: "A+",
          medicalHistory: "Post-covid mild cough, allergic to Penicillin.",
        },
      },
    },
    include: { patientProfile: true },
  });

  console.log("✅ Patients created:", patient1User.email, patient2User.email);

  // 4. Create Appointments & Prescriptions
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 4);

  const pastDate = new Date(today);
  pastDate.setDate(pastDate.getDate() - 5);

  // Upcoming appointment 1
  const appt1 = await prisma.appointment.create({
    data: {
      patientId: patient1User.id,
      doctorId: createdDoctors[0].id, // Dr. Sarah Smith
      date: tomorrow,
      timeSlot: "10:30 AM",
      status: "CONFIRMED",
      type: "VIDEO",
      paymentStatus: "PAID",
      notes: "Follow up on recent lipid panel and blood pressure check.",
    },
  });

  // Upcoming appointment 2
  await prisma.appointment.create({
    data: {
      patientId: patient1User.id,
      doctorId: createdDoctors[1].id, // Dr. Michael Chen
      date: nextWeek,
      timeSlot: "02:00 PM",
      status: "PENDING",
      type: "IN_PERSON",
      paymentStatus: "UNPAID",
      notes: "Routine skin rash consultation on upper arm.",
    },
  });

  // Completed appointment with Prescription
  const completedAppt = await prisma.appointment.create({
    data: {
      patientId: patient1User.id,
      doctorId: createdDoctors[0].id,
      date: pastDate,
      timeSlot: "09:00 AM",
      status: "COMPLETED",
      type: "VIDEO",
      paymentStatus: "PAID",
      notes: "Initial cardiac evaluation and ECG review.",
    },
  });

  await prisma.prescription.create({
    data: {
      appointmentId: completedAppt.id,
      doctorId: createdDoctors[0].id,
      patientId: patient1User.id,
      diagnosis: "Essential Hypertension (Mild Stage 1)",
      medicines: JSON.stringify([
        { name: "Amlodipine Besylate", dose: "5mg", frequency: "Once daily in morning", duration: "30 Days" },
        { name: "CoQ10 Heart Support", dose: "100mg", frequency: "Once daily with meal", duration: "60 Days" },
      ]),
      pdfUrl: "/samples/prescription-sample.pdf",
    },
  });

  console.log("✅ Seeded Appointments & Sample Prescription!");
  console.log("🎉 Seed process completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
