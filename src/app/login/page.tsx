"use client";
export const dynamic = 'force-dynamic';

import React, { Suspense, useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../context/AuthContext";

const schema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type FormData = z.infer<typeof schema>;

function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const { signIn, user, session, loading } = useAuth();

  const handleRedirect = useCallback(async () => {
    if (isRedirecting) return;
    
    try {
      setIsRedirecting(true);
      const destination = redirectedFrom || "/dashboard";
      console.log("[LoginForm] Redirecting to:", destination);
      await router.push(destination);
    } catch (err) {
      console.error("[LoginForm] Redirect error:", err);
      setError("Gagal melakukan redirect. Silakan refresh halaman.");
    } finally {
      setIsRedirecting(false);
    }
  }, [redirectedFrom, router, isRedirecting]);

  useEffect(() => {
    if (!loading && user && session) {
      console.log("[LoginForm] User session detected, initiating redirect");
      handleRedirect();
    }
  }, [user, session, loading, handleRedirect]);

  const onSubmit = async (data: FormData) => {
    if (isRedirecting) return;

    try {
      setError("");
      console.log("[LoginForm] Attempting login...");
      const result = await signIn(data.email, data.password);
      
      if (!result.success) {
        setError(result.error?.message || "Login gagal. Silakan coba lagi.");
        console.error("[LoginForm] Login failed:", result.error);
        return;
      }

      console.log("[LoginForm] Login successful");
      // Don't call handleRedirect here - useEffect will handle it
      
    } catch (err) {
      console.error("[LoginForm] Login error:", err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat login. Silakan coba lagi.");
    }
  };

  // Prevent form submission during redirect
  if (isRedirecting || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input 
            id="email" 
            type="email" 
            {...register("email")}
            className="w-full border rounded px-3 py-2" 
            autoComplete="email" 
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input 
            id="password" 
            type="password" 
            {...register("password")}
            className="w-full border rounded px-3 py-2" 
            autoComplete="current-password" 
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Login..." : "Login"}
        </button>
        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
      <p className="mt-4 text-center text-sm">
        Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline">Daftar</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}