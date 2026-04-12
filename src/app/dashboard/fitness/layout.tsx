import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fitness Tracker",
};

export default function FitnessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
