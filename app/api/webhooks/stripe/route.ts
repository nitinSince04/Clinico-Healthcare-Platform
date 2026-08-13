import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    try {
      if (webhookSecret && webhookSecret !== "whsec_mock_key" && signature) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } else {
        // Fallback for direct API testing or webhook simulation
        event = JSON.parse(body);
      }
    } catch (err: any) {
      console.error(`Webhook Signature Verification Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle checkout.session.completed or payment_intent.succeeded
    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
      const session = event.data?.object;
      const appointmentId = session?.metadata?.appointmentId || session?.client_reference_id;
      const paymentIntentId = session?.payment_intent || session?.id;

      if (appointmentId) {
        await db.appointment.update({
          where: { id: appointmentId },
          data: {
            paymentStatus: "PAID",
            status: "CONFIRMED",
            stripePaymentId: paymentIntentId ? String(paymentIntentId) : `pi_stripe_${Date.now()}`,
          },
        });
        console.log(`✅ Appointment ${appointmentId} marked as PAID via Stripe Webhook.`);
      }
    }

    return NextResponse.json({ received: true, type: event.type });
  } catch (error: any) {
    console.error("Stripe Webhook Error:", error);
    return NextResponse.json({ error: error.message || "Webhook processing failed." }, { status: 500 });
  }
}
