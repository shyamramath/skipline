import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

// Price IDs for your plans - Replace these with actual Stripe price IDs from your dashboard
// You can create these at https://dashboard.stripe.com/products

// One-time inspection prices
const INSPECTION_PRICES: Record<string, { priceId: string; amount: number }> = {
  basic: { priceId: "price_inspection_basic", amount: 19900 },      // $199
  standard: { priceId: "price_inspection_standard", amount: 34900 }, // $349
  premium: { priceId: "price_inspection_premium", amount: 54900 },   // $549
};

// Subscription maintenance prices
const MAINTENANCE_PRICES: Record<string, Record<string, string>> = {
  essential: {
    monthly: "price_essential_monthly",  // $29/month
    yearly: "price_essential_yearly",    // $299/year
  },
  plus: {
    monthly: "price_plus_monthly",       // $59/month
    yearly: "price_plus_yearly",         // $599/year
  },
  total: {
    monthly: "price_total_monthly",      // $99/month
    yearly: "price_total_yearly",        // $999/year
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plan, billingPeriod, planType } = body;

    if (!plan || !planType) {
      return NextResponse.json(
        { error: "Missing plan or plan type" },
        { status: 400 }
      );
    }

    const origin = request.headers.get("origin") || "http://localhost:3000";

    if (planType === "inspection") {
      // One-time payment for inspection
      const inspectionPlan = INSPECTION_PRICES[plan.toLowerCase()];

      if (!inspectionPlan) {
        return NextResponse.json(
          { error: "Invalid inspection plan" },
          { status: 400 }
        );
      }

      // Create a one-time payment checkout session
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Home Inspection`,
                description: "Professional home inspection service",
              },
              unit_amount: inspectionPlan.amount,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscription?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    } else if (planType === "maintenance") {
      // Subscription for maintenance plans
      if (!billingPeriod) {
        return NextResponse.json(
          { error: "Missing billing period for maintenance plan" },
          { status: 400 }
        );
      }

      const maintenancePlan = MAINTENANCE_PRICES[plan.toLowerCase()];
      if (!maintenancePlan) {
        return NextResponse.json(
          { error: "Invalid maintenance plan" },
          { status: 400 }
        );
      }

      const priceId = maintenancePlan[billingPeriod];
      if (!priceId) {
        return NextResponse.json(
          { error: "Invalid billing period" },
          { status: 400 }
        );
      }

      // For subscriptions, you need to have created prices in Stripe Dashboard
      // Using price_data for demo purposes
      const amounts: Record<string, Record<string, number>> = {
        essential: { monthly: 2900, yearly: 29900 },
        plus: { monthly: 5900, yearly: 59900 },
        total: { monthly: 9900, yearly: 99900 },
      };

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Maintenance Plan`,
                description: `${billingPeriod === "monthly" ? "Monthly" : "Annual"} home maintenance subscription`,
              },
              unit_amount: amounts[plan.toLowerCase()]?.[billingPeriod] || 2900,
              recurring: {
                interval: billingPeriod === "monthly" ? "month" : "year",
              },
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/subscription?canceled=true`,
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Invalid plan type" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
