import Stripe from "stripe";
import { loadStripe as loadStripeJs, Stripe as StripeJs } from "@stripe/stripe-js";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock_key", {
  apiVersion: "2024-06-20" as any,
  typescript: true,
});

let stripePromise: Promise<StripeJs | null>;

export const getStripeJs = () => {
  if (!stripePromise) {
    stripePromise = loadStripeJs(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_mock_key");
  }
  return stripePromise;
};
