/**
 * Billing operations: customer onboarding and one-off charges.
 */
import Stripe from "stripe";

import { stripe } from "./stripe";

/** Create a Stripe customer for a newly signed up user. */
export async function createCustomer(
  email: string,
  name: string
): Promise<Stripe.Customer> {
  return stripe.customers.create({
    email,
    name,
    metadata: { source: "guinea-billing" },
  });
}

/**
 * Create a card payment intent for the given amount.
 *
 * @param amountCents Amount in the smallest currency unit (e.g. cents).
 * @param customerId Stripe customer the payment belongs to.
 */
export async function chargeCustomer(
  amountCents: number,
  customerId: string,
  currency = "usd"
): Promise<Stripe.PaymentIntent> {
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency,
    customer: customerId,
    payment_method_types: ["card"],
    description: "guinea-billing one-off charge",
  });
}

/** List the most recent invoices for a customer. */
export async function recentInvoices(
  customerId: string,
  limit = 10
): Promise<Stripe.Invoice[]> {
  const invoices = await stripe.invoices.list({ customer: customerId, limit });
  return invoices.data;
}

/** True when the error is a card being declined, not a bug in our request. */
export function isCardError(err: unknown): boolean {
  return err instanceof Stripe.errors.StripeCardError;
}
