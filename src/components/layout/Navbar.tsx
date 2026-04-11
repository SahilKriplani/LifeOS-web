"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { useState, useEffect } from "react";
import { logout } from "@/lib/auth";
import toast from "react-hot-toast";

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/dashboard/planner", icon: CalendarDays },
  { label: "DSA", href: "/dashboard/dsa", icon: Code2 },
  { label: "Fitness", href: "/dashboard/fitness", icon: Dumbbell },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="glass-strong fixed top-0 left-0 right-0 z-50"
      style={{ height: "var(--navbar-height)" }}
    >
      <div className="h-full max-w-screen-xl mx-auto px-6 flex items-center justify-between">
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

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-lg cursor-pointer"
                style={{
                  background: "var(--muted)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                {/* Avatar */}
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center font-semibold text-xs"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() ?? <User size={12} />}
                </div>
                <span
                  className="text-xs font-medium hidden md:block max-w-20 truncate"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.name ?? "Account"}
                </span>
                <ChevronDown
                  size={12}
                  style={{ color: "var(--muted-foreground)" }}
                />
              </motion.button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 glass border"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px)",
                borderColor: "var(--glass-border)",
              }}
            >
              {/* User info */}
              <DropdownMenuLabel className="flex flex-col gap-0.5">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--foreground)" }}
                >
                  {user?.name ?? "User"}
                </span>
                <span
                  className="text-xs font-normal truncate"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {user?.email ?? ""}
                </span>
              </DropdownMenuLabel>

              <DropdownMenuSeparator
                style={{ background: "var(--glass-border)" }}
              />

              {/* Dashboard */}
              <DropdownMenuItem
                onClick={() => router.push("/dashboard")}
                className="cursor-pointer gap-2"
                style={{ color: "var(--foreground)" }}
              >
                <LayoutDashboard size={14} />
                Dashboard
              </DropdownMenuItem>

              {/* Settings */}
              <DropdownMenuItem
                onClick={() => router.push("/dashboard/settings")}
                className="cursor-pointer gap-2"
                style={{ color: "var(--foreground)" }}
              >
                <Settings size={14} />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator
                style={{ background: "var(--glass-border)" }}
              />

              {/* Logout */}
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer gap-2 text-rose-400 focus:text-rose-400"
              >
                <LogOut size={14} />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
