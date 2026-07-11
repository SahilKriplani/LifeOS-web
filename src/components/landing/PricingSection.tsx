"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/border-beam";

const ease = [0.16, 1, 0.3, 1] as const;

type Plan = {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // per-year total
  oneTime?: number;
  cta: string;
  highlight?: boolean;
  features: string[];
};

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "Everything you need to build the habit.",
    monthly: 0,
    yearly: 0,
    cta: "Start free",
    features: [
      "Planner, Goals, DSA, Fitness & Streaks",
      "Up to 3 active goals",
      "30-day history",
      "Light & dark themes",
      "Responsive on every device",
    ],
  },
  {
    name: "Pro",
    tagline: "The full operating system for your life.",
    monthly: 299,
    yearly: 2990,
    cta: "Get Pro",
    highlight: true,
    features: [
      "Everything in Free",
      "Finance & Budgeting",
      "AI Weekly Review",
      "Analytics & productivity score",
      "Unlimited goals & full history",
      "Smart reminders + Notes",
      "Data export (CSV / JSON)",
    ],
  },
  {
    name: "Lifetime",
    tagline: "Pay once. Keep it forever.",
    monthly: 0,
    yearly: 0,
    oneTime: 4999,
    cta: "Get Lifetime",
    features: [
      "Everything in Pro, forever",
      "One-time payment — no subscription",
      "Early-access founder pricing",
      "Vote on the roadmap",
      "All future modules included",
    ],
  },
];

export default function PricingSection() {
  const [yearly, setYearly] = useState(false);

  const priceLabel = (plan: Plan) => {
    if (plan.oneTime) return `₹${plan.oneTime.toLocaleString("en-IN")}`;
    if (plan.monthly === 0) return "₹0";
    return yearly
      ? `₹${Math.round(plan.yearly / 12)}`
      : `₹${plan.monthly}`;
  };

  const priceSuffix = (plan: Plan) => {
    if (plan.oneTime) return "one-time";
    if (plan.monthly === 0) return "forever";
    return "/mo";
  };

  return (
    <section id="pricing" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[42rem] h-[42rem] rounded-full opacity-[0.06] blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center text-center gap-4 mb-10"
        >
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide glass"
            style={{ color: "var(--primary)" }}
          >
            SIMPLE, HONEST PRICING
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Start free.{" "}
            <span style={{ color: "var(--primary)" }}>Upgrade when it clicks.</span>
          </h2>
          <p className="text-base max-w-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
            No credit card to start. No lock-in — your data is always yours to
            export.
          </p>

          {/* Billing toggle */}
          <div
            className="mt-2 inline-flex items-center gap-1 p-1 rounded-full glass"
            role="group"
            aria-label="Billing period"
          >
            {(["Monthly", "Yearly"] as const).map((label, i) => {
              const active = (i === 1) === yearly;
              return (
                <button
                  key={label}
                  onClick={() => setYearly(i === 1)}
                  className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                  style={{ color: active ? "var(--primary-foreground)" : "var(--foreground)" }}
                >
                  {active && (
                    <motion.span
                      layoutId="billing-pill"
                      className="absolute inset-0 rounded-full"
                      style={{ background: "var(--primary)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {label}
                    {label === "Yearly" && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{
                          background: active
                            ? "rgba(255,255,255,0.2)"
                            : "var(--muted)",
                          color: active ? "var(--primary-foreground)" : "var(--primary)",
                        }}
                      >
                        2 months free
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease }}
              className={cn(
                "relative rounded-2xl p-7 flex flex-col gap-6",
                plan.highlight ? "glass-strong md:-mt-4 md:mb-4" : "glass",
              )}
            >
              {plan.highlight && (
                <>
                  <BorderBeam
                    size={120}
                    duration={8}
                    colorFrom="var(--primary)"
                    colorTo="var(--accent)"
                  />
                  <span
                    className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold shadow-sm"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    <Sparkles size={12} /> Most popular
                  </span>
                </>
              )}

              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold" style={{ color: "var(--foreground)" }}>
                  {plan.name}
                </h3>
                <p className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  {plan.tagline}
                </p>
              </div>

              <div className="flex items-end gap-1.5">
                <span className="text-4xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
                  {priceLabel(plan)}
                </span>
                <span className="text-sm mb-1.5" style={{ color: "var(--muted-foreground)" }}>
                  {priceSuffix(plan)}
                </span>
              </div>

              <Link href="/register" className="block">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                  style={
                    plan.highlight
                      ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                      : { background: "var(--muted)", color: "var(--foreground)", border: "1px solid var(--glass-border)" }
                  }
                >
                  {plan.cta}
                </motion.button>
              </Link>

              <ul className="flex flex-col gap-3 mt-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--foreground)" }}>
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: "var(--primary)" }}
                    >
                      <Check size={11} className="text-white" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--muted-foreground)" }}>
          Prices in INR. Pro & Lifetime billing rolls out with public launch — early users keep founder pricing.
        </p>
      </div>
    </section>
  );
}
