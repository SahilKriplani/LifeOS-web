"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/shared/Logo";
import useUserStore from "@/store/useUserStore";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  Code2,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Target,
  Wallet,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AnimatedThemeToggler } from "../ui/animated-theme-toggler";

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/dashboard/planner", icon: CalendarDays },
  { label: "DSA", href: "/dashboard/dsa", icon: Code2 },
  { label: "Fitness", href: "/dashboard/fitness", icon: Dumbbell },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Finance", href: "/dashboard/finance", icon: Wallet },
];

// ─── Dock icon (Apple-style magnification) ──────────────────────────────────────
function DockIcon({
  mouseX,
  label,
  href,
  icon: Icon,
  isActive,
}: {
  mouseX: MotionValue<number>;
  label: string;
  href: string;
  icon: React.ElementType;
  isActive: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Horizontal distance from the cursor to this icon's center.
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const spring = { mass: 0.1, stiffness: 170, damping: 14 };
  const sizeSync = useTransform(distance, [-110, 0, 110], [38, 56, 38]);
  const size = useSpring(sizeSync, spring);
  const iconScaleSync = useTransform(distance, [-110, 0, 110], [1, 1.45, 1]);
  const iconScale = useSpring(iconScaleSync, spring);

  return (
    <Link href={href} aria-label={label}>
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center rounded-xl transition-colors duration-200"
        title={label}
      >
        {/* Active background */}
        {isActive && (
          <motion.div
            layoutId="dockActive"
            className="absolute inset-0 rounded-xl"
            style={{
              background: "var(--primary)",
              boxShadow:
                "0 4px 18px color-mix(in srgb, var(--primary) 45%, transparent)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          />
        )}
        <motion.span
          style={{ scale: iconScale }}
          className="relative z-10 flex items-center justify-center"
        >
          <Icon
            size={18}
            style={{
              color: isActive
                ? "var(--primary-foreground)"
                : "var(--muted-foreground)",
            }}
          />
        </motion.span>

        {/* Hover label — below the icon since the navbar sits at the top */}
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ opacity: 0, y: -4, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 whitespace-nowrap rounded-lg px-2.5 py-1 text-xs font-medium"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                border: "1px solid var(--glass-border)",
                color: "var(--foreground)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mouseX = useMotionValue(Infinity);

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
            <LogoMark size={32} />
            <span
              className="font-semibold text-base tracking-tight hidden sm:block"
              style={{ color: "var(--foreground)" }}
            >
              LifeOS
            </span>
          </Link>

          {/* ── Magnifying dock — desktop only ── */}
          <nav
            onMouseMove={(e) => mouseX.set(e.clientX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="hidden lg:flex items-center gap-2 px-2"
          >
            {navLinks.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);
              return (
                <DockIcon
                  key={href}
                  mouseX={mouseX}
                  label={label}
                  href={href}
                  icon={Icon}
                  isActive={isActive}
                />
              );
            })}
          </nav>

          {/* ── Right Side ── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-200"
              style={{
                background: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              <AnimatedThemeToggler />
            </motion.div>

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
