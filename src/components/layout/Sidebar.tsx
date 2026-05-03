"use client";

import { cn } from "@/lib/utils";
import useUserStore from "@/store/useUserStore";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Code2,
  Dumbbell,
  LayoutDashboard,
  LogOut,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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

// ─── Animation variants ───────────────────────────────────────────────────────
const sidebarVariants = {
  expanded: { width: 240 },
  collapsed: { width: 68 },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 z-40 flex flex-col"
      style={{
        top: "var(--navbar-height)",
        height: "calc(100vh - var(--navbar-height))",
        background: "var(--glass-bg)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      {/* ── Nav Links ── */}
      <nav className="flex-1 py-5 px-3 flex flex-col gap-1">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 4 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 relative"
                style={
                  isActive
                    ? {
                        background: "var(--primary)18",
                        color: "var(--primary)",
                      }
                    : {
                        color: "var(--muted-foreground)",
                      }
                }
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: "var(--primary)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200",
                    isActive ? "shadow-sm" : "",
                  )}
                  style={
                    isActive
                      ? {
                          background: "var(--primary)",
                          color: "var(--primary-foreground)",
                        }
                      : {
                          background: "transparent",
                          color: "var(--muted-foreground)",
                        }
                  }
                >
                  <Icon size={16} />
                </div>

                {/* Label */}
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "text-sm font-medium whitespace-nowrap",
                        isActive ? "font-semibold" : "",
                      )}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Section ── */}
      <div className="px-3 pb-5 flex flex-col gap-2">
        {/* User info */}
        <AnimatePresence>
          {!collapsed && user && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-2.5 rounded-xl mb-1"
              style={{
                background: "var(--muted)",
                border: "1px solid var(--glass-border)",
              }}
            >
              {/* Avatar + name */}
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0"
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
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout */}
        <motion.button
          whileHover={{ x: collapsed ? 0 : 4 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200"
          style={{ color: "var(--muted-foreground)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "rgba(244,63,94,0.1)",
              color: "#f43f5e",
            }}
          >
            <LogOut size={16} />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-rose-400"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Collapse toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggle}
          className="flex items-center justify-center w-8 h-8 rounded-lg self-end transition-colors duration-200"
          style={{
            background: "var(--muted)",
            color: "var(--muted-foreground)",
            border: "1px solid var(--glass-border)",
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </motion.button>
      </div>
    </motion.aside>
  );
}
