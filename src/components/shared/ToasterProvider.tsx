"use client";

import { Toaster } from "react-hot-toast";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ToasterProvider() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: isDark
            ? "rgba(6, 15, 14, 0.85)"
            : "rgba(240, 253, 250, 0.85)",
          color: isDark ? "#F0FDFA" : "#060F0E",
          border: isDark
            ? "1px solid rgba(20, 184, 166, 0.2)"
            : "1px solid rgba(13, 148, 136, 0.15)",
          backdropFilter: "blur(12px)",
          fontSize: "14px",
          borderRadius: "10px",
          boxShadow: isDark
            ? "0 8px 32px rgba(20, 184, 166, 0.15)"
            : "0 8px 32px rgba(13, 148, 136, 0.1)",
        },
        success: {
          iconTheme: {
            primary: "#14B8A6",
            secondary: isDark ? "#060F0E" : "#F0FDFA",
          },
        },
        error: {
          iconTheme: {
            primary: "#f43f5e",
            secondary: isDark ? "#060F0E" : "#F0FDFA",
          },
        },
      }}
    />
  );
}
