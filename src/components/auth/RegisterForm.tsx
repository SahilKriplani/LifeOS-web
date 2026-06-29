"use client";

import EmailOtpForm from "@/components/auth/EmailOtpForm";

// Passwordless sign-up: email OTP + Google SSO. The whole flow lives in
// EmailOtpForm; this wrapper just fixes the mode for the /register route.
export default function RegisterForm() {
  return <EmailOtpForm mode="register" />;
}
