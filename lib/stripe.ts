import Stripe from "stripe";

let cachedStripe: Stripe | null | undefined;

export function getStripeClient() {
  if (cachedStripe !== undefined) {
    return cachedStripe;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    cachedStripe = null;
    return cachedStripe;
  }

  cachedStripe = new Stripe(secretKey);
  return cachedStripe;
}

export function getBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}
