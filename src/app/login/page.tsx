"use client";
export const dynamic = 'force-dynamic';

import React, { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from '../../lib/supabase';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");

  const onSubmit = async (data: FormData) => {
    try {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setError(error.message || "Login gagal. Periksa email dan password Anda.");
        return;
      }
      const user = signInData.user;
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setError("Gagal mendapatkan sesi pengguna.");
        return;
      }
      if (!sessionData.session) {
        setError("Login gagal, sesi tidak ditemukan.");
        return;
      }
      window.location.href = redirectedFrom || "/dashboard";
    } catch (err) {
      console.error("Error during login:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setError("");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input id="email" type="email" {...register("email")}
            className="w-full border rounded px-3 py-2" autoComplete="email" />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="block mb-1">Password</label>
          <input id="password" type="password" {...register("password")}
            className="w-full border rounded px-3 py-2" autoComplete="current-password" />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          {isSubmitting ? "Login..." : "Login"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
      <p className="mt-4 text-center text-sm">Belum punya akun? <Link href="/register" className="text-blue-600 hover:underline">Daftar</Link></p>
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