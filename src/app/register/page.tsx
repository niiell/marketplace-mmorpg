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

type FormData = z.infer;

export default function RegisterPage() {
const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
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

Daftar


Email
<input id="email" type="email" {...register("email")}
className="w-full border rounded px-3 py-2" autoComplete="email" />
{errors.email && {errors.email.message}}


Password
<input id="password" type="password" {...register("password")}
className="w-full border rounded px-3 py-2" autoComplete="new-password" />
{errors.password && {errors.password.message}}


Konfirmasi Password
<input id="confirmPassword" type="password" {...register("confirmPassword")}
className="w-full border rounded px-3 py-2" autoComplete="new-password" />
{errors.confirmPassword && {errors.confirmPassword.message}}


{isSubmitting ? "Mendaftar..." : "Daftar"}

{error && {error}}
{success && {success}}

Sudah punya akun? Masuk

);
}