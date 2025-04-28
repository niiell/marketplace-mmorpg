"use client";
import Navbar from "@/components/Navbar";
import NotificationToaster from "@/components/NotificationToaster";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <NotificationToaster />
      {children}
    </>
  );
}
