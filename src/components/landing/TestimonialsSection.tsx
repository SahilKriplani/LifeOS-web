"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Rocket,
  Dumbbell,
  GraduationCap,
  Wallet,
  Target,
  Flame,
  BarChart3,
} from "lucide-react";
import { Marquee } from "@/components/ui/marquee";

const ease = [0.16, 1, 0.3, 1] as const;

type Persona = {
  name: string;
  role: string;
  quote: string;
  icon: React.ElementType;
  from: string;
  to: string;
};

// Persona-based social proof — who LifeOS is built for. Role-forward and
// honest (illustrative), not invented 5-star strangers.
const personas: Persona[] = [
  {
    name: "Aarav",
    role: "SDE-2, prepping for FAANG",
    quote:
      "My DSA streak and interview goals finally live in the same place I plan my day.",
    icon: Code2,
    from: "#14B8A6",
    to: "#0ea5e9",
  },
  {
    name: "Meera",
    role: "Indie founder",
    quote:
      "I cancelled four subscriptions. Tasks, goals, notes and budget are one tab now.",
    icon: Rocket,
    from: "#8b5cf6",
    to: "#ec4899",
  },
  {
    name: "Rohan",
    role: "On a 50kg cut",
    quote:
      "Logging workouts next to my weight trend kept me honest for seven straight months.",
    icon: Dumbbell,
    from: "#ec4899",
    to: "#f97316",
  },
  {
    name: "Sara",
    role: "Final-year student",
    quote:
      "Assignments, gym and savings in one planner that never felt like more homework.",
    icon: GraduationCap,
    from: "#0ea5e9",
    to: "#14B8A6",
  },
  {
    name: "Dev",
    role: "Freelance designer",
    quote:
      "Manual budgeting that shows where my income actually goes — no bank-linking creepiness.",
    icon: Wallet,
    from: "#06b6d4",
    to: "#3b82f6",
  },
  {
    name: "Priya",
    role: "Product manager",
    quote:
      "The weekly review reads my real data and tells me what slipped. A coach that doesn't make things up.",
    icon: Target,
    from: "#f43f5e",
    to: "#a855f7",
  },
  {
    name: "Karan",
    role: "Career switcher",
    quote:
      "Streaks turned 'learn to code' from a vibe into 120 days I can actually see.",
    icon: Flame,
    from: "#f97316",
    to: "#eab308",
  },
  {
    name: "Ananya",
    role: "Analyst & marathoner",
    quote:
      "One honest productivity score beats the ten dashboards I used to ignore.",
    icon: BarChart3,
    from: "#eab308",
    to: "#14B8A6",
  },
];

function PersonaCard({ p }: { p: Persona }) {
  const initials = p.name.slice(0, 1);
  return (
    <figure className="glass rounded-2xl p-5 w-[340px] shrink-0 flex flex-col gap-4">
      <figcaption className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center text-base font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${p.from}, ${p.to})` }}
          >
            {initials}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
            style={{ background: "var(--background)" }}
          >
            <div
              className="w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: p.from }}
            >
              <p.icon size={9} className="text-white" />
            </div>
          </div>
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            {p.name}
          </div>
          <div className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            {p.role}
          </div>
        </div>
      </figcaption>
      <blockquote
        className="text-sm leading-relaxed"
        style={{ color: "var(--foreground)" }}
      >
        &ldquo;{p.quote}&rdquo;
      </blockquote>
    </figure>
  );
}

export default function TestimonialsSection() {
  const row1 = personas.slice(0, 4);
  const row2 = personas.slice(4);

  return (
    <section id="testimonials" className="py-28 relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease }}
        className="flex flex-col items-center text-center gap-4 mb-14 px-6"
      >
        <span
          className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide glass"
          style={{ color: "var(--primary)" }}
        >
          BUILT FOR EVERYONE
        </span>
        <h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
          style={{ color: "var(--foreground)" }}
        >
          One system,{" "}
          <span style={{ color: "var(--primary)" }}>every kind of ambition.</span>
        </h2>
        <p className="text-base max-w-xl leading-relaxed" style={{ color: "var(--muted-foreground)" }}>
          Engineers, founders, students, lifters — anyone with goals worth
          tracking. Here&apos;s who LifeOS is built for.
        </p>
      </motion.div>

      <div className="relative flex flex-col gap-5">
        <Marquee pauseOnHover className="[--duration:46s]">
          {row1.map((p) => (
            <PersonaCard key={p.name} p={p} />
          ))}
        </Marquee>
        <Marquee reverse pauseOnHover className="[--duration:52s]">
          {row2.map((p) => (
            <PersonaCard key={p.name} p={p} />
          ))}
        </Marquee>

        {/* Edge fades */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 w-32 z-10"
          style={{ background: "linear-gradient(to right, var(--background), transparent)" }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-32 z-10"
          style={{ background: "linear-gradient(to left, var(--background), transparent)" }}
        />
      </div>

      <p
        className="text-center text-xs mt-10 px-6"
        style={{ color: "var(--muted-foreground)" }}
      >
        Illustrative personas — LifeOS is in early access.
      </p>
    </section>
  );
}
