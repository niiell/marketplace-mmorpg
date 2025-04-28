import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

const schema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
  password: z.string().min(6, { message: 'Password minimal 6 karakter' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Daftar Akun</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1">Email</label>
          <input type="email" {...register('email')} className="w-full border rounded px-3 py-2" autoComplete="email" />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Password</label>
          <input type="password" {...register('password')} className="w-full border rounded px-3 py-2" autoComplete="new-password" />
          {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
        </div>
        <div>
          <label className="block mb-1">Konfirmasi Password</label>
          <input type="password" {...register('confirmPassword')} className="w-full border rounded px-3 py-2" autoComplete="new-password" />
          {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition">
          {isSubmitting ? 'Mendaftar...' : 'Daftar'}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>
    </div>
  );
}