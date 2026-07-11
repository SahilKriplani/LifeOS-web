"use client";

import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 transition-all duration-200",
      "data-[state=open]:animate-in data-[state=closed]:animate-out",
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className,
    )}
    style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(6px)" }}
    {...props}
  />
));
SheetOverlay.displayName = DialogPrimitive.Overlay.displayName;

// ─── Side panel that slides in from the right; full-height, capped width ──────
const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 right-0 z-50 flex flex-col",
        "w-full sm:w-[28rem] sm:max-w-[90vw] h-dvh",
        "duration-300",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
        className,
      )}
      style={{
        background: "var(--glass-bg)",
        backdropFilter: "blur(32px) saturate(200%)",
        WebkitBackdropFilter: "blur(32px) saturate(200%)",
        borderLeft: "1px solid var(--glass-border)",
        boxShadow: `
          0 0 0 1px var(--glass-border),
          -24px 0 64px rgba(20,184,166,0.14),
          -8px 0 24px rgba(0,0,0,0.35)
        `,
      }}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 z-20 rounded-lg opacity-70 transition-all hover:opacity-100 focus:outline-none disabled:pointer-events-none"
        style={{ background: "var(--muted)", padding: "4px", color: "var(--muted-foreground)" }}
      >
        <X size={14} />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = DialogPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1 px-6 pt-6", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-bold tracking-tight", className)}
    style={{ color: "var(--foreground)" }}
    {...props}
  />
));
SheetTitle.displayName = DialogPrimitive.Title.displayName;

const SheetDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm", className)}
    style={{ color: "var(--muted-foreground)" }}
    {...props}
  />
));
SheetDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetPortal,
  SheetTitle,
  SheetTrigger,
};
