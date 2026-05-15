"use client";

import { logout } from "@/lib/auth";
import useUserStore from "@/store/useUserStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  Code2,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Settings,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

// ─── Nav links ────────────────────────────────────────────────────────────────
const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Planner", href: "/dashboard/planner", icon: CalendarDays },
  { label: "DSA", href: "/dashboard/dsa", icon: Code2 },
  { label: "Fitness", href: "/dashboard/fitness", icon: Dumbbell },
  { label: "Goals", href: "/dashboard/goals", icon: Target },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

// ─── Dock item ────────────────────────────────────────────────────────────────
function DockItem({
  href,
  icon: Icon,
  label,
  isActive,
  mouseY,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  mouseY: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [center, setCenter] = useState<number | null>(null);

  const handleMouseEnter = () => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setCenter(rect.top + rect.height / 2);
    }
  };

  const distance =
    mouseY !== null && center !== null ? Math.abs(mouseY - center) : 999;

  const scale = isActive
    ? 1.2
    : distance < 60
      ? 1.5 - (distance / 60) * 0.5
      : distance < 100
        ? 1.1 - (distance / 100) * 0.1
        : 1;

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        onMouseEnter={handleMouseEnter}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
        className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
        style={
          isActive
            ? {
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                boxShadow:
                  "0 4px 20px color-mix(in srgb, var(--primary) 50%, transparent)",
              }
            : {
                color: "var(--muted-foreground)",
              }
        }
        title={label}
      >
        {/* Pulse ring on active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-xl border-2"
            style={{ borderColor: "var(--primary)" }}
            animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <Icon size={18} className="relative z-10" />
      </motion.div>
    </Link>
  );
}

// ─── Mobile bottom nav ────────────────────────────────────────────────────────
function MobileNav() {
  const pathname = usePathname();

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderTop: "1px solid var(--glass-border)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2 safe-area-pb">
        {navLinks.slice(0, 5).map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link key={href} href={href}>
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl"
                style={
                  isActive
                    ? { color: "var(--primary)" }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <div className="relative w-6 h-6 flex items-center justify-center">
                  {isActive && (
                    <motion.div
                      layoutId="mobileActive"
                      className="absolute inset-0 rounded-lg"
                      style={{ background: "var(--primary)20" }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon size={18} />
                </div>
                <span className="text-xs font-medium">{label}</span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Desktop dock sidebar ─────────────────────────────────────────────────────
function DesktopSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [hovered, setHovered] = useState(false);
  const [mouseY, setMouseY] = useState<number | null>(null);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <div
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setMouseY(null);
      }}
      onMouseMove={(e) => setMouseY(e.clientY)}
    >
      {/* Glass popup panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, x: -16, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="absolute left-16 top-1/2 -translate-y-1/2 rounded-2xl py-3 px-2 flex flex-col gap-1 min-w-48"
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
              <>
                <div className="px-3 py-2 flex items-center gap-2.5 mb-1">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
                    style={{
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
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
                <div
                  className="h-px mx-2 mb-1"
                  style={{ background: "var(--glass-border)" }}
                />
              </>
            )}

            {/* Nav links */}
            {navLinks.map(({ label, href, icon: Icon }) => {
              const isActive =
                href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(href);

              return (
                <Link key={href} href={href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer"
                    style={
                      isActive
                        ? {
                            background: "var(--primary)18",
                            color: "var(--primary)",
                          }
                        : { color: "var(--muted-foreground)" }
                    }
                  >
                    <Icon size={15} className="shrink-0" />
                    <span className="text-sm font-medium">{label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="popupActive"
                        className="ml-auto w-1.5 h-1.5 rounded-full"
                        style={{ background: "var(--primary)" }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}

            <div
              className="h-px mx-2 my-1"
              style={{ background: "var(--glass-border)" }}
            />

            {/* Logout */}
            <motion.button
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-xl w-full"
              style={{ color: "#f43f5e" }}
            >
              <LogOut size={15} className="shrink-0" />
              <span className="text-sm font-medium">Logout</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mac-style dock rail ── */}
      <motion.div
        animate={{
          boxShadow: hovered
            ? "0 20px 60px rgba(20,184,166,0.35)"
            : "0 8px 32px rgba(20,184,166,0.15)",
        }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center gap-1.5 py-4 px-2.5 rounded-2xl"
        style={{
          background: "var(--glass-bg)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid var(--glass-border)",
        }}
      >
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <DockItem
              key={href}
              href={href}
              icon={Icon}
              label={label}
              isActive={isActive}
              mouseY={mouseY}
            />
          );
        })}

        <div
          className="w-6 h-px my-1"
          style={{ background: "var(--glass-border)" }}
        />

        {/* Logout dock icon */}
        <motion.button
          animate={{
            scale: mouseY !== null ? 1 : 1,
          }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleLogout}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ color: "#f43f5e" }}
          title="Logout"
        >
          <LogOut size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Sidebar(_props: SidebarProps) {
  return (
    <>
      <DesktopSidebar />
      <MobileNav />
    </>
  );
}
