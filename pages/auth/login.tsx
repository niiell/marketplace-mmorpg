// filepath: pages/auth/login.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const schema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError(error.message);
      return;
    }
    // Optional: check email confirmation
    const user = signInData.user;
    if (user && !user.email_confirmed_at) {
      setError('Email Anda belum diverifikasi. Silakan cek email Anda untuk verifikasi.');
      return;
    }
    router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full border rounded px-3 py-2" autoComplete="email" />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" {...register('password')} className="w-full border rounded px-3 py-2" autoComplete="current-password" />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          {isSubmitting ? 'Login...' : 'Login'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}
