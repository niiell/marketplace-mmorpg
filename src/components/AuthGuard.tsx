"use client";

import { ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";

interface AuthGuardProps {
  children: ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  console.debug("[AuthGuard] loading:", loading, "user:", user, "pathname:", pathname);

  if (loading) {
    console.debug("[AuthGuard] Loading state, rendering loading indicator");
    return <div>Loading...</div>;
  }

  if (!user) {
    const redirectUrl = `/login?redirectedFrom=${encodeURIComponent(pathname)}`;
    console.debug("[AuthGuard] No user, redirecting to:", redirectUrl);
    router.replace(redirectUrl);
    return null;
  }

  console.debug("[AuthGuard] User authenticated, rendering children");
  return <>{children}</>;
}
