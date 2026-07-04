"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/Logo";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

// Hydration-safe "are we on the client yet?" flag. Returns false during SSR and
// the first client render, then true — without setting state inside an effect
// (which the react-hooks lint rule forbids). Used to defer theme-dependent icons
// until after hydration so server and client markup match.
const emptySubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mounted = useMounted();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-3 inset-x-0 z-50 px-4"
    >
      <motion.div
        animate={{
          maxWidth: scrolled ? 880 : 1024,
          paddingTop: scrolled ? 8 : 10,
          paddingBottom: scrolled ? 8 : 10,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "mx-auto flex items-center justify-between gap-4 rounded-2xl px-4 transition-colors duration-300",
          scrolled ? "glass-nav" : "border border-transparent",
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <LogoMark size={32} />
          <span
            className="font-semibold text-base tracking-tight"
            style={{ color: "var(--foreground)" }}
          >
            LifeOS
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="px-3 py-1.5 rounded-lg text-sm font-medium opacity-65 transition-all duration-200 hover:opacity-100 hover:bg-[var(--muted)]"
              style={{ color: "var(--foreground)" }}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {mounted && theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>

          <Link href="/login" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{ color: "var(--foreground)", background: "var(--muted)" }}
            >
              Log in
            </motion.button>
          </Link>

          <Link href="/register" className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-1.5 rounded-lg text-sm font-semibold shadow-sm"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Get Started
            </motion.button>
          </Link>

          <button
            className="md:hidden p-1"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            style={{ color: "var(--foreground)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="md:hidden glass-nav mx-auto mt-2 max-w-[1024px] rounded-2xl px-5 py-4 flex flex-col gap-3"
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium opacity-80"
              style={{ color: "var(--foreground)" }}
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex gap-2 pt-1">
            <Link href="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
              <button
                className="w-full px-4 py-2 rounded-lg text-sm font-medium"
                style={{ color: "var(--foreground)", background: "var(--muted)" }}
              >
                Log in
              </button>
            </Link>
            <Link href="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
              <button
                className="w-full px-4 py-2 rounded-lg text-sm font-semibold"
                style={{
                  background: "var(--primary)",
                  color: "var(--primary-foreground)",
                }}
              >
                Get Started
              </button>
            </Link>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
