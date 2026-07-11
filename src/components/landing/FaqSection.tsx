"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";

const ease = [0.16, 1, 0.3, 1] as const;

const faqs = [
  {
    q: "Is my data private?",
    a: "Yes. Your data is yours — single-user by design, never sold, and exportable to CSV/JSON anytime. We don't mine it or share it.",
  },
  {
    q: "Do you connect to my bank?",
    a: "No, and that's deliberate. Finance in LifeOS is manual entry only — no bank or Plaid linking, no card numbers, no investment trading. You stay in control, and there's no compliance risk to your accounts.",
  },
  {
    q: "Does the AI make things up?",
    a: "No. The weekly review is grounded strictly in your own logged data — it summarizes real numbers and never invents stats. If a value is missing, it says so instead of guessing.",
  },
  {
    q: "Is it really free?",
    a: "The Free plan is genuinely free forever — all the core trackers, no credit card. You only upgrade if you want Finance, AI review, analytics and unlimited history.",
  },
  {
    q: "Can I use it on my phone?",
    a: "Yes. LifeOS is fully responsive and works as a web app on any device — no install required.",
  },
  {
    q: "Will my data carry over when new modules ship?",
    a: "Always. Every module shares one data model, so Finance, Analytics and AI insights build on the data you're already logging today.",
  },
];

function FaqItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-base font-semibold" style={{ color: "var(--foreground)" }}>
          {q}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25, ease }}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "var(--muted)", color: "var(--primary)" }}
        >
          <Plus size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease }}
          >
            <p
              className="px-6 pb-5 text-sm leading-relaxed"
              style={{ color: "var(--muted-foreground)" }}
            >
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="py-28 relative scroll-mt-24">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="flex flex-col items-center text-center gap-4 mb-12"
        >
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide glass"
            style={{ color: "var(--primary)" }}
          >
            QUESTIONS, ANSWERED
          </span>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            Honest answers,{" "}
            <span style={{ color: "var(--primary)" }}>no fine print.</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease }}
            >
              <FaqItem
                q={f.q}
                a={f.a}
                isOpen={open === i}
                onClick={() => setOpen(open === i ? null : i)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
