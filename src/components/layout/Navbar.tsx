"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  // useEffect(() => {
  //   setMobileOpen(false);
  // }, [pathname]);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "glass-strong shadow-lg" : "glass-strong",
        )}
        style={{ height: "var(--navbar-height)" }}
      >
        <div className="h-full max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
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
              className="font-semibold text-base tracking-tight hidden sm:block"
              style={{ color: "var(--foreground)" }}
            >
              LifeOS
            </span>
          </Link>

          {/* ── Nav Links — desktop only ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
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

            {/* Notifications — hidden on small mobile */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex w-8 h-8 rounded-lg items-center justify-center transition-colors duration-200"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              <Bell size={15} />
            </motion.button>

            {/* Profile dropdown — desktop */}
            <div className="hidden lg:block">
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
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center font-semibold text-xs"
                      style={{
                        background: "var(--primary)",
                        color: "var(--primary-foreground)",
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() ?? "S"}
                    </div>
                    <span
                      className="text-xs font-medium max-w-20 truncate"
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
                  className="w-52"
                  style={{
                    background: "var(--glass-bg)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
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
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard")}
                    className="cursor-pointer gap-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    <LayoutDashboard size={14} /> Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/dashboard/settings")}
                    className="cursor-pointer gap-2"
                    style={{ color: "var(--foreground)" }}
                  >
                    <Settings size={14} /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator
                    style={{ background: "var(--glass-border)" }}
                  />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer gap-2 text-rose-400 focus:text-rose-400"
                  >
                    <LogOut size={14} /> Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Mobile menu button — tablet/mobile only */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile menu dropdown ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-16 left-0 right-0 z-40 lg:hidden mx-4 rounded-2xl overflow-hidden"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid var(--glass-border)",
              boxShadow: "var(--glass-shadow)",
            }}
          >
            {/* User info */}
            {user && (
              <div
                className="flex items-center gap-3 px-4 py-3 border-b"
                style={{ borderColor: "var(--glass-border)" }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{
                    background: "var(--primary)",
                    color: "var(--primary-foreground)",
                  }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--foreground)" }}
                  >
                    {user.name}
                  </p>
                  <p
                    className="text-xs truncate"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            {/* Nav links */}
            <div className="p-2 flex flex-col gap-1">
              {navLinks.map(({ label, href, icon: Icon }, i) => {
                const isActive =
                  href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(href);

                return (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={href}>
                      <div
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-200"
                        style={
                          isActive
                            ? {
                                background: "var(--primary)18",
                                color: "var(--primary)",
                              }
                            : { color: "var(--muted-foreground)" }
                        }
                      >
                        <Icon size={16} />
                        <span className="text-sm font-medium">{label}</span>
                        {isActive && (
                          <div
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ background: "var(--primary)" }}
                          />
                        )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}

              {/* Settings + Logout */}
              <div
                className="h-px my-1"
                style={{ background: "var(--glass-border)" }}
              />

              <Link href="/dashboard/settings">
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  <Settings size={16} />
                  <span className="text-sm font-medium">Settings</span>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-left"
                style={{ color: "#f43f5e" }}
              >
                <LogOut size={16} />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
