"use server";

import { getAuthSession } from "@/lib/auth";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: string;
  suggestedSpecialty?: string;
  suggestedDoctorLink?: string;
}

export async function sendPatientChatMessage(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): Promise<{ success: boolean; reply?: ChatMessage; error?: string }> {
  try {
    const session = await getAuthSession();
    if (!session || !session.user) {
      return { success: false, error: "Authentication required to consult Clinico AI." };
    }

    const lastUserMessage = messages[messages.length - 1]?.content || "";
    const lowerMessage = lastUserMessage.toLowerCase();

    let replyText = "";
    let suggestedSpecialty: string | undefined;
    let suggestedDoctorLink: string | undefined;

    // Intelligent Healthcare Triage Knowledge Engine
    if (lowerMessage.includes("chest") || lowerMessage.includes("heart") || lowerMessage.includes("palpitation") || lowerMessage.includes("blood pressure") || lowerMessage.includes("hypertension")) {
      suggestedSpecialty = "Cardiology";
      suggestedDoctorLink = "/doctors?specialty=Cardiology";
      replyText = `### 🫀 Cardiology Triage Guidance

**Observation**: Your description references symptoms related to cardiovascular health (e.g., chest tightness, heart palpitations, or blood pressure concerns).

**Recommended Action**:
1. **Specialist Evaluation**: We strongly advise scheduling a consultation with a board-certified **Cardiologist**.
2. **Pre-Visit Note**: Please record your blood pressure readings over the past 48 hours if available.
3. **Emergency Warning**: If you are experiencing sudden severe chest pain, shortness of breath, or radiating arm pain, **call emergency services (911/112) immediately**.

Would you like to review available Cardiology specialists now?`;
    } else if (lowerMessage.includes("skin") || lowerMessage.includes("rash") || lowerMessage.includes("acne") || lowerMessage.includes("eczema") || lowerMessage.includes("mole")) {
      suggestedSpecialty = "Dermatology";
      suggestedDoctorLink = "/doctors?specialty=Dermatology";
      replyText = `### 🩺 Dermatology Triage Guidance

**Observation**: Your inquiry relates to dermatological conditions (skin rash, lesions, eczema, or mole inspection).

**Recommended Action**:
1. **Specialist Consultation**: Schedule an appointment with a **Dermatologist** for a visual assessment.
2. **Telehealth Prep**: Capture 2-3 clear, well-lit photos of the affected skin area to upload during your visit.
3. **General Care**: Avoid applying new topical creams until evaluated by a specialist.`;
    } else if (lowerMessage.includes("headache") || lowerMessage.includes("migraine") || lowerMessage.includes("dizzy") || lowerMessage.includes("numbness") || lowerMessage.includes("seizure")) {
      suggestedSpecialty = "Neurology";
      suggestedDoctorLink = "/doctors?specialty=Neurology";
      replyText = `### 🧠 Neurology Triage Guidance

**Observation**: You are reporting symptoms associated with the nervous system (headaches, migraines, dizziness, or sensory changes).

**Recommended Action**:
1. **Specialist Consultation**: We recommend consulting a **Neurologist** for a thorough neurological evaluation.
2. **Symptom Tracker**: Keep track of the duration, frequency, and potential triggers (light, stress, food).
3. **Red Flags**: Seek urgent emergency care if accompanied by sudden weakness, confusion, or difficulty speaking.`;
    } else if (lowerMessage.includes("child") || lowerMessage.includes("baby") || lowerMessage.includes("infant") || lowerMessage.includes("pediatric") || lowerMessage.includes("kid")) {
      suggestedSpecialty = "Pediatrics";
      suggestedDoctorLink = "/doctors?specialty=Pediatrics";
      replyText = `### 👶 Pediatric Care Triage

**Observation**: Your question concerns pediatric healthcare and child wellness.

**Recommended Action**:
1. **Pediatric Specialist**: Connect with one of our verified **Pediatricians** tailored for infant and child health.
2. **Temperature & Appetite**: Note down recent temperature readings, fluid intake, and behavior changes.
3. **Urgent Notice**: High fever in infants under 3 months requires immediate emergency medical evaluation.`;
    } else if (lowerMessage.includes("bone") || lowerMessage.includes("joint") || lowerMessage.includes("knee") || lowerMessage.includes("back pain") || lowerMessage.includes("fracture")) {
      suggestedSpecialty = "Orthopedics";
      suggestedDoctorLink = "/doctors?specialty=Orthopedics";
      replyText = `### 🦴 Orthopedic Triage Guidance

**Observation**: Your symptoms suggest musculoskeletal involvement (joint pain, back discomfort, or bone injury).

**Recommended Action**:
1. **Specialist Visit**: Consult an **Orthopedic Specialist** for joint, bone, and spinal care.
2. **Initial Relief**: Apply ice for acute swelling or heat for chronic muscle stiffness, resting the affected joint.`;
    } else if (lowerMessage.includes("fever") || lowerMessage.includes("flu") || lowerMessage.includes("cold") || lowerMessage.includes("cough") || lowerMessage.includes("tired") || lowerMessage.includes("fatigue")) {
      suggestedSpecialty = "General Medicine";
      suggestedDoctorLink = "/doctors?specialty=General+Medicine";
      replyText = `### 🩺 General Wellness & Primary Care

**Observation**: You are describing general systemic symptoms (fever, seasonal flu, cough, or general fatigue).

**Recommended Action**:
1. **Primary Care Visit**: Schedule a virtual consultation with a **General Physician**.
2. **Self-Care Tips**: Stay hydrated with fluids, get adequate rest, and monitor body temperature.`;
    } else if (lowerMessage.includes("prescription") || lowerMessage.includes("medicine") || lowerMessage.includes("refill") || lowerMessage.includes("dose")) {
      replyText = `### 💊 Medication & E-Prescription Support

**Clinico Platform Feature**:
1. **Digital Prescriptions**: All prescriptions issued during your virtual consultations are instantly generated as signed PDF documents.
2. **Dashboard Access**: You can download your official PDF prescription anytime under your **Patient Dashboard -> Historical Visits**.
3. **Refills**: For dosage modifications or medication refills, book a quick follow-up with your consulting physician.`;
    } else if (lowerMessage.includes("appointment") || lowerMessage.includes("book") || lowerMessage.includes("pay") || lowerMessage.includes("stripe")) {
      replyText = `### 📅 Appointment Booking & Stripe Payments

**How Booking Works**:
1. Select any doctor from our **[Specialist Directory](/doctors)**.
2. Choose your preferred Date and Time slot.
3. Pay securely via **Stripe Encrypted Checkout**.
4. Your appointment will immediately appear in your **Patient Portal** with HD Telehealth Video links!`;
    } else {
      suggestedSpecialty = "General Medicine";
      suggestedDoctorLink = "/doctors?specialty=General+Medicine";
      replyText = `### 🤖 Clinico AI Medical Triage Assistant

Thank you for reaching out to Clinico AI Health Support! 

**Summary**: I am trained to assist with initial symptom triage, specialist routing, and telehealth consultation prep.

**How I Can Help You**:
- 🩺 **Specialist Selection**: Describe your symptoms (e.g. *headache, chest discomfort, skin rash, joint stiffness*) for tailored doctor recommendations.
- 📋 **Consultation Prep**: Learn what medical records or photos to gather before your visit.
- 💳 **Billing & Prescriptions**: Questions about Stripe payments or PDF prescription downloads.

*Disclaimer: Clinico AI is an informational triage guide. For acute emergencies, call 911 or visit the nearest emergency ER immediately.*`;
    }

    const aiMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: "assistant",
      content: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggestedSpecialty,
      suggestedDoctorLink,
    };

    return { success: true, reply: aiMessage };
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return { success: false, error: error.message || "Failed to process AI chat message." };
  }
}
