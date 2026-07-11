"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BorderBeam } from "@/components/ui/border-beam";

const ease = [0.16, 1, 0.3, 1] as const;

export default function CtaSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="relative overflow-hidden glass-strong rounded-3xl px-8 py-16 sm:px-16 flex flex-col items-center text-center gap-6"
        >
          {/* Gradient wash */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.14]"
            style={{
              background:
                "radial-gradient(60% 80% at 50% 0%, var(--primary) 0%, transparent 70%)",
            }}
          />
          <BorderBeam
            size={160}
            duration={10}
            colorFrom="var(--primary)"
            colorTo="var(--accent)"
          />

          <h2
            className="relative text-3xl sm:text-5xl font-bold tracking-tight max-w-2xl"
            style={{ color: "var(--foreground)" }}
          >
            Your life, finally{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(110deg, var(--primary), var(--accent) 55%, var(--secondary))",
              }}
            >
              organized.
            </span>
          </h2>

          <p
            className="relative text-base sm:text-lg max-w-xl leading-relaxed"
            style={{ color: "var(--muted-foreground)" }}
          >
            Stop juggling six apps and a graveyard of Notion templates. Start
            free today and build the system that actually keeps up with you.
          </p>

          <div className="relative flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Link href="/register">
              <ShimmerButton
                background="var(--primary)"
                shimmerColor="#ffffff"
                borderRadius="12px"
                className="px-8 py-3.5 text-sm font-semibold shadow-lg"
              >
                <span className="flex items-center gap-2 text-white">
                  Get started free
                  <ArrowRight size={16} />
                </span>
              </ShimmerButton>
            </Link>
            <Link href="/login">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-xl text-sm font-medium glass"
                style={{ color: "var(--foreground)" }}
              >
                I already have an account
              </motion.button>
            </Link>
          </div>

          <p className="relative text-xs" style={{ color: "var(--muted-foreground)" }}>
            Free forever plan · No credit card · Export anytime
          </p>
        </motion.div>
      </div>
    </section>
  );
}
