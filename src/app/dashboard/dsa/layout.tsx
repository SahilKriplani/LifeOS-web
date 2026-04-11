import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DSA Tracker",
};

export default function DSALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
