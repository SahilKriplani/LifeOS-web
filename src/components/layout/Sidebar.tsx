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
import { usePathname } from "next/navigation";

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

const labelVariants = {
  expanded: { opacity: 1, x: 0, display: "block" },
  collapsed: { opacity: 0, x: -10, transitionEnd: { display: "none" } },
};

// ─── Props ────────────────────────────────────────────────────────────────────
interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={collapsed ? "collapsed" : "expanded"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="glass-strong fixed left-0 z-40 flex flex-col"
      style={{
        top: "var(--navbar-height)",
        height: "calc(100vh - var(--navbar-height))",
        borderRight: "1px solid var(--glass-border)",
      }}
    >
      {/* ── Nav Links ── */}
      <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
        {navLinks.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;

          return (
            <Link key={href} href={href}>
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200",
                  isActive ? "" : "hover:bg-muted",
                )}
                style={
                  isActive
                    ? {
                        background: "var(--muted)",
                        color: "var(--accent)",
                        borderLeft: "2px solid var(--primary)",
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <Icon
                  size={18}
                  style={isActive ? { color: "var(--accent)" } : {}}
                  className="shrink-0"
                />

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      variants={labelVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
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
      <div className="px-3 pb-4 flex flex-col gap-2">
        {/* User info */}
        {!collapsed && user && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-3 py-2 rounded-lg"
            style={{ background: "var(--muted)" }}
          >
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
          </motion.div>
        )}

        {/* Logout */}
        <motion.button
          whileHover={{ x: 3 }}
          whileTap={{ scale: 0.97 }}
          onClick={clearUser}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors duration-200"
          style={{ color: "var(--muted-foreground)" }}
        >
          <LogOut size={18} className="shrink-0" />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                variants={labelVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                transition={{ duration: 0.2 }}
                className="text-sm font-medium"
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
          }}
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </motion.button>
      </div>
    </motion.aside>
  );
}
