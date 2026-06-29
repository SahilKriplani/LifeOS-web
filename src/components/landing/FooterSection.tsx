"use client";

import { motion } from "framer-motion";
import { CalendarDays, Code2, Dumbbell, Target, Mail, Phone } from "lucide-react";
import { FaGithub, FaXTwitter, FaGlobe, FaEnvelope, FaLinkedinIn } from "react-icons/fa6";
import Link from "next/link";

const PORTFOLIO_URL = "https://sahil-portfolio-gamma-three.vercel.app/";
const TWITTER_URL = "https://x.com/kriplani_sahil7";
const GITHUB_URL = "https://github.com/sahilkriplani";
const LINKEDIN_URL = "https://www.linkedin.com/in/sahil-kriplani-96b555234/";
const EMAIL = "s.s.ksahil543@gmail.com";
const PHONE_DISPLAY = "+91 99097 06362";
const PHONE_TEL = "+919909706362";

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
    heading: "Explore",
    links: [
      { label: "Features", href: "#features" },
      { label: "How it works", href: "#how" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    heading: "Founder",
    links: [
      { label: "About the founder", href: PORTFOLIO_URL, external: true },
      { label: "LinkedIn", href: LINKEDIN_URL, external: true },
      { label: "GitHub", href: GITHUB_URL, external: true },
      { label: "Twitter / X", href: TWITTER_URL, external: true },
      { label: "Email", href: `mailto:${EMAIL}`, external: true },
    ],
  },
];

const socialLinks = [
  { icon: FaGlobe, href: PORTFOLIO_URL, label: "Portfolio" },
  { icon: FaLinkedinIn, href: LINKEDIN_URL, label: "LinkedIn" },
  { icon: FaGithub, href: GITHUB_URL, label: "GitHub" },
  { icon: FaXTwitter, href: TWITTER_URL, label: "Twitter / X" },
  { icon: FaEnvelope, href: `mailto:${EMAIL}`, label: "Email" },
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
              One operating system for your whole life — planner, goals,
              habits, fitness and finances in a single, beautifully designed
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

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-100 opacity-70 w-fit"
                style={{ color: "var(--foreground)" }}
              >
                <Mail size={14} style={{ color: "var(--primary)" }} />
                {EMAIL}
              </a>
              <a
                href={`tel:${PHONE_TEL}`}
                className="flex items-center gap-2 text-sm transition-opacity hover:opacity-100 opacity-70 w-fit"
                style={{ color: "var(--foreground)" }}
              >
                <Phone size={14} style={{ color: "var(--primary)" }} />
                {PHONE_DISPLAY}
              </a>
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
                  {section.links.map((link) =>
                    "external" in link && link.external ? (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm transition-colors duration-200 hover:opacity-100 opacity-60 w-fit"
                        style={{ color: "var(--foreground)" }}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-sm transition-colors duration-200 hover:opacity-100 opacity-60 w-fit"
                        style={{ color: "var(--foreground)" }}
                      >
                        {link.label}
                      </Link>
                    ),
                  )}
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
            © 2026 LifeOS. Designed & built by{" "}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:opacity-100 opacity-80 transition-opacity"
              style={{ color: "var(--primary)" }}
            >
              Sahil Kriplani
            </a>
            .
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
