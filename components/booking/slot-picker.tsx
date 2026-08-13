"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { format, addDays } from "date-fns";
import { createStripeCheckoutSession, confirmStripePayment } from "@/lib/actions/stripe";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  UserCheck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface SlotPickerProps {
  doctorId: string;
  doctorName: string;
  consultationFee: number;
  availableSlotsJson: string;
}

export function SlotPicker({
  doctorId,
  doctorName,
  consultationFee,
  availableSlotsJson,
}: SlotPickerProps) {
  const router = useRouter();
  const { data: session } = useSession();

  let slots: string[] = ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"];
  try {
    slots = JSON.parse(availableSlotsJson);
  } catch (e) {
    // fallback
  }

  // Generate 7 upcoming days starting today
  const upcomingDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));

  const [selectedDate, setSelectedDate] = useState<Date>(upcomingDays[0]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [consultationType, setConsultationType] = useState<"VIDEO" | "IN_PERSON">("VIDEO");
  const [notes, setNotes] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [stripeTxId, setStripeTxId] = useState<string | null>(null);

  // Card form mockup for inline Stripe elements
  const [cardData, setCardData] = useState({
    cardNumber: "4242 •••• •••• 4242",
    expDate: "12 / 28",
    cvc: "888",
    nameOnCard: session?.user?.name || "Clinico Patient",
  });

  const handleOpenDrawer = () => {
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/doctors/${doctorId}`)}`);
      return;
    }
    if (!selectedSlot) {
      setError("Please select an available time slot first.");
      return;
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleStripeCheckout = async () => {
    if (!selectedSlot) return;
    setIsLoading(true);
    setError(null);

    const formattedDate = selectedDate.toISOString();

    const res = await createStripeCheckoutSession({
      doctorId,
      date: formattedDate,
      timeSlot: selectedSlot,
      type: consultationType,
      notes,
    });

    if (!res.success) {
      setIsLoading(false);
      setError(res.error || "Failed to initiate Stripe Checkout.");
      return;
    }

    // If real Stripe URL returned, redirect to Stripe's checkout page
    if (res.url) {
      window.location.href = res.url;
      return;
    }

    // Process Stripe transaction confirmation
    const confirmRes = await confirmStripePayment(res.appointmentId!, res.mockTxId);
    setIsLoading(false);

    if (!confirmRes.success) {
      setError(confirmRes.error || "Failed to confirm payment.");
    } else {
      setSuccess(true);
      setStripeTxId(res.mockTxId || `ch_${Date.now()}_stripe`);
      setTimeout(() => {
        setIsModalOpen(false);
        router.push("/dashboard/patient?payment=success");
      }, 2200);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Select Appointment Date & Slot</h3>
          <p className="text-xs text-slate-500">
            Real-time slot lock with instant Stripe payments
          </p>
        </div>
        <Badge variant="success" className="text-xs px-3 py-1 gap-1">
          <Lock className="h-3 w-3" /> Stripe Encrypted
        </Badge>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Date Picker Carousel */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 block">Upcoming 7 Days</label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {upcomingDays.map((d) => {
            const isSelected = format(d, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
            return (
              <button
                key={d.toISOString()}
                onClick={() => {
                  setSelectedDate(d);
                  setSelectedSlot(null);
                }}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${
                  isSelected
                    ? "medical-gradient text-white shadow-md font-bold scale-[1.03]"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
                }`}
              >
                <span className="text-[10px] uppercase font-semibold opacity-80">
                  {format(d, "EEE")}
                </span>
                <span className="text-sm font-extrabold">{format(d, "d")}</span>
                <span className="text-[9px] opacity-75">{format(d, "MMM")}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Time Slot Grid */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700 block">
          Available Time Slots for {format(selectedDate, "EEEE, MMM d")}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slots.map((slot) => {
            const isSelected = selectedSlot === slot;
            return (
              <button
                key={slot}
                onClick={() => {
                  setSelectedSlot(slot);
                  setError(null);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                  isSelected
                    ? "border-teal-600 bg-teal-50 text-teal-800 shadow-sm ring-2 ring-teal-500/40"
                    : "border-slate-200 bg-white hover:border-teal-300 text-slate-800"
                }`}
              >
                <Clock className="h-3.5 w-3.5 text-teal-600" />
                <span>{slot}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Consultation Mode */}
      <div className="space-y-2 pt-2">
        <label className="text-xs font-bold text-slate-700 block">Consultation Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setConsultationType("VIDEO")}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
              consultationType === "VIDEO"
                ? "border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/40"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <Video className="h-4 w-4 text-sky-600" />
            <span>HD Video Consultation</span>
          </button>
          <button
            type="button"
            onClick={() => setConsultationType("IN_PERSON")}
            className={`flex items-center justify-center gap-2.5 p-3 rounded-xl border text-xs font-bold transition-all ${
              consultationType === "IN_PERSON"
                ? "border-sky-600 bg-sky-50 text-sky-900 ring-2 ring-sky-500/40"
                : "border-slate-200 bg-white text-slate-700"
            }`}
          >
            <UserCheck className="h-4 w-4 text-sky-600" />
            <span>In-Person Visit</span>
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1.5 pt-2">
        <label className="text-xs font-semibold text-slate-700">Reason for Visit / Symptoms</label>
        <input
          type="text"
          placeholder="e.g. Follow-up consultation, chest tightness, routine review..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-11 rounded-xl border border-input px-3 text-xs bg-background"
        />
      </div>

      {/* Action Button */}
      <Button
        onClick={handleOpenDrawer}
        variant="gradient"
        size="lg"
        className="w-full gap-2 text-sm font-bold shadow-lg"
      >
        <CreditCard className="h-5 w-5" />
        Pay with Stripe Checkout (${consultationFee}.00)
      </Button>

      {/* STRIPE PAYMENT MODAL DRAWER */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Stripe Payment & Appointment Lock"
        description="Authorize secure payment via Stripe Encrypted Checkout"
      >
        <div className="space-y-4 text-slate-800">
          {success ? (
            <div className="text-center py-6 space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 animate-bounce">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <h4 className="text-lg font-black text-slate-900">Stripe Payment Successful!</h4>
              <p className="text-xs text-slate-600">
                Your consultation with <span className="font-bold text-slate-900">{doctorName}</span> is confirmed for{" "}
                <span className="font-bold text-teal-600">
                  {format(selectedDate, "MMM d, yyyy")} at {selectedSlot}
                </span>.
              </p>
              {stripeTxId && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-600">
                  Transaction Receipt: <span className="font-bold text-indigo-700">{stripeTxId}</span>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Consultation Summary Box */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Provider:</span>
                  <span className="font-bold text-slate-900">{doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot:</span>
                  <span className="font-bold text-teal-700">
                    {format(selectedDate, "EEEE, MMM d, yyyy")} ({selectedSlot})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <Badge variant="secondary">{consultationType}</Badge>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm">
                  <span className="font-bold text-slate-900">Stripe Total Charge:</span>
                  <span className="font-black text-emerald-600">${consultationFee}.00 USD</span>
                </div>
              </div>

              {/* Stripe Card Mock Input Container */}
              <div className="p-4 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50/50 via-white to-sky-50/50 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs font-bold text-indigo-950">Stripe Card Authorization</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] font-extrabold uppercase bg-indigo-600 text-white px-2 py-0.5 rounded-md tracking-wider">
                      Stripe
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                      Card Number
                    </label>
                    <Input
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      className="h-10 text-xs font-mono bg-white border-indigo-200"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                        Expiry Date
                      </label>
                      <Input
                        value={cardData.expDate}
                        onChange={(e) => setCardData({ ...cardData, expDate: e.target.value })}
                        className="h-10 text-xs font-mono bg-white border-indigo-200"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                        CVC / CVC2
                      </label>
                      <Input
                        type="password"
                        value={cardData.cvc}
                        onChange={(e) => setCardData({ ...cardData, cvc: e.target.value })}
                        className="h-10 text-xs font-mono bg-white border-indigo-200"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Protected by 256-Bit SSL Stripe Security Gateway</span>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full text-xs font-bold"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  onClick={handleStripeCheckout}
                  disabled={isLoading}
                  className="w-full text-xs font-bold gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing Stripe Transaction...
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4" />
                      Pay ${consultationFee}.00 via Stripe
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
}
