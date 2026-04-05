"use client";

import { motion } from "framer-motion";
import { CalendarDays, Code2, Dumbbell, Target } from "lucide-react";
import { FaGithub, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";

// ─── Links data ───────────────────────────────────────────────────────────────
const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Planner", href: "/dashboard/planner" },
      { label: "DSA Tracker", href: "/dashboard/dsa" },
      { label: "Fitness", href: "/dashboard/fitness" },
    ],
  },
  {
    heading: "Features",
    links: [
      { label: "Streak System", href: "#features" },
      { label: "Goal Rings", href: "#features" },
      { label: "Analytics", href: "#features" },
      { label: "Daily Planner", href: "#features" },
    ],
  },
  {
    heading: "Developer",
    links: [
      { label: "GitHub", href: "https://github.com/sahilkriplani" },
      { label: "Portfolio", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "Twitter", href: "#" },
    ],
  },
];

const socialLinks = [
  { icon: FaGithub, href: "https://github.com/sahilkriplani", label: "GitHub" },
  { icon: FaTwitter, href: "#", label: "Twitter" },
  { icon: FaLinkedinIn, href: "#", label: "LinkedIn" },
];

const modules = [
  { icon: Code2, label: "DSA", color: "#14B8A6" },
  { icon: Dumbbell, label: "Fitness", color: "#8b5cf6" },
  { icon: CalendarDays, label: "Planner", color: "#06b6d4" },
  { icon: Target, label: "Goals", color: "#ec4899" },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function FooterSection() {
  return (
    <footer
      id="about"
      className="relative pt-20 pb-8 border-t"
      style={{ borderColor: "var(--glass-border)" }}
    >
      {/* Background blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full opacity-10 blur-3xl"
          style={{ background: "var(--primary)" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Top section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand col */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                L
              </div>
              <span
                className="font-semibold text-base tracking-tight"
                style={{ color: "var(--foreground)" }}
              >
                LifeOS
              </span>
            </Link>

            {/* Tagline */}
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              Your personal life operating system. Track DSA progress, fitness
              goals, daily tasks, and streaks — all in one beautifully designed
              workspace.
            </p>

            {/* Module pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {modules.map((mod) => (
                <div
                  key={mod.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: `${mod.color}15`,
                    border: `1px solid ${mod.color}30`,
                    color: mod.color,
                  }}
                >
                  <mod.icon size={11} />
                  {mod.label}
                </div>
              ))}
            </div>

            {/* Social links */}
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
                  style={{
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  }}
                  aria-label={social.label}
                >
                  <social.icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links cols */}
          <div className="lg:col-span-3 grid grid-cols-3 gap-8">
            {footerLinks.map((section) => (
              <div key={section.heading} className="flex flex-col gap-4">
                <span
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {section.heading}
                </span>
                <div className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:opacity-100 opacity-60 w-fit"
                      style={{ color: "var(--foreground)" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-8"
          style={{ background: "var(--glass-border)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs" style={{ color: "var(--muted-foreground)" }}>
            © 2025 LifeOS. Built by{" "}
            <a
              href="https://github.com/sahilkriplani"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-100 opacity-80 transition-opacity"
              style={{ color: "var(--primary)" }}
            >
              Sahil Kriplani
            </a>
            . Open source on GitHub.
          </p>

          <div className="flex items-center gap-1.5">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--primary)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              v1.0 in development
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
