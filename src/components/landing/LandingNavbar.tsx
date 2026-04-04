"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = ["Features", "Stats", "About"];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "glass-strong border-b" : "bg-transparent",
      )}
      style={{ height: "64px" }}
    >
      <div className="h-full max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
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

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200 hover:opacity-100 opacity-60"
              style={{ color: "var(--foreground)" }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun size={15} />
              ) : (
                <Moon size={15} />
              )
            ) : (
              <Sun size={15} />
            )}
          </motion.button>

          {/* Login */}
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:flex items-center px-4 py-1.5 rounded-lg text-sm font-medium"
              style={{
                border: "1px solid var(--glass-border)",
                color: "var(--foreground)",
                background: "var(--muted)",
              }}
            >
              Log in
            </motion.button>
          </Link>

          {/* Get Started */}
          <Link href="/dashboard">
            <motion.button
              whileHover={{ scale: 1.03, opacity: 0.9 }}
              whileTap={{ scale: 0.97 }}
              className="hidden md:flex items-center px-4 py-1.5 rounded-lg text-sm font-semibold"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              Get Started
            </motion.button>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: "var(--foreground)" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass-strong border-t px-6 py-4 flex flex-col gap-4"
        >
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-medium"
              style={{ color: "var(--foreground)" }}
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
          <Link href="/dashboard">
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
        </motion.div>
      )}
    </motion.header>
  );
}
