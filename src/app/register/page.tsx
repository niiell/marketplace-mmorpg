"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Email tidak valid" }),
  password: z.string().min(6, { message: "Password minimal 6 karakter" }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    try {
      setError("");
      setSuccess("");
      console.log("Attempting to register with:", data.email);
      
      // 1. Sign up the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      console.log("Registration response:", { authData });

      if (signUpError) {
        console.error("Registration error:", signUpError);
        setError(signUpError.message);
        return;
      }

      if (authData?.user) {
        try {
          // 2. Create initial profile with RLS policy
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([{ 
              user_id: authData.user.id,
              username: data.email.split("@")[0], // Set default username from email
              created_at: new Date().toISOString()
            }]);
          
          if (profileError) {
            console.error("Profile creation error details:", profileError);
            // Don't return here, still show success message since user was created
          }
          
          setSuccess("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
          
          // Optional: Redirect to login page after successful registration
          setTimeout(() => {
            router.push("/login");
          }, 2000);
          
        } catch (profileErr) {
          console.error("Unexpected profile creation error:", profileErr);
          // Still show success since user was created
          setSuccess("Registrasi berhasil! Silakan cek email Anda untuk verifikasi.");
        }
      }
    } catch (e) {
      console.error("Unexpected error during registration:", e);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" {...register("email")}
            className="w-full border rounded px-3 py-2" autoComplete="email" />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" {...register("password")}
            className="w-full border rounded px-3 py-2" autoComplete="new-password" />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} 
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition disabled:opacity-50">
          {isSubmitting ? "Mendaftar..." : "Daftar"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
      </form>
      <p className="mt-4 text-center text-sm">Sudah punya akun? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
    </div>
  );
}
