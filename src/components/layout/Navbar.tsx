"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Moon,
  LayoutDashboard,
  CalendarDays,
  Code2,
  Dumbbell,
  Target,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/dashboard/planner", icon: CalendarDays },
  { label: "DSA", href: "/dashboard/dsa", icon: Code2 },
  { label: "Fitness", href: "/dashboard/fitness", icon: Dumbbell },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
];
// Add this import
import { useState, useEffect } from "react";

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const user = useUserStore((state) => state.user);
  // Add inside component, after existing hooks
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-strong fixed top-0 left-0 right-0 z-50"
      style={{ height: "var(--navbar-height)" }}
    >
      <div className="h-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
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

        {/* ── Nav Links ── */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link key={href} href={href}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200",
                    isActive ? "text-primary-foreground" : "hover:bg-muted",
                  )}
                  style={
                    isActive
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : { color: "var(--muted-foreground)" }
                  }
                >
                  <Icon size={14} />
                  {label}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* ── Right Side ── */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
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

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
            style={{
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            <Bell size={15} />
          </motion.button>

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer font-semibold text-sm"
            style={{
              background: "var(--primary)",
              color: "var(--primary-foreground)",
            }}
          >
            {user?.name?.charAt(0).toUpperCase() ?? <User size={15} />}
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}
