/**
 * Shared Stripe client for the billing service.
 *
 * The API version is pinned so behavior stays stable across SDK updates.
 */
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2020-08-27",
  maxNetworkRetries: 2,
  typescript: true,
});
