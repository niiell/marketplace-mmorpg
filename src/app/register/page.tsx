"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
  confirmPassword: z.string().min(6, { message: "Konfirmasi password minimal 6 karakter" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak cocok",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setError("");
    setSuccess("");
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setError(error.message || "Gagal mendaftar. Silakan coba lagi.");
        return;
      }
      setSuccess("Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi.");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
    }
  };

  return (
    <>
      <h1>Daftar</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={`w-full border rounded px-3 py-2 ${errors.email ? "border-red-600" : ""}`}
            autoComplete="email"
          />
          {errors.email && <p className="text-red-600">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            {...register("password")}
            className={`w-full border rounded px-3 py-2 ${errors.password ? "border-red-600" : ""}`}
            autoComplete="new-password"
          />
          {errors.password && <p className="text-red-600">{errors.password.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Konfirmasi Password</label>
          <input
            id="confirmPassword"
            type="password"
            {...register("confirmPassword")}
            className={`w-full border rounded px-3 py-2 ${errors.confirmPassword ? "border-red-600" : ""}`}
            autoComplete="new-password"
          />
          {errors.confirmPassword && <p className="text-red-600">{errors.confirmPassword.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isSubmitting ? "Mendaftar..." : "Daftar"}
        </button>
      </form>

      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

      <p className="mt-4">
        Sudah punya akun?{" "}
        <Link href="/login" className="text-blue-600 underline">
          Masuk
        </Link>
      </p>
    </>
  );
}