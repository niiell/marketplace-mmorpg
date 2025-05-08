'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '../../lib/supabase';

const schema = z.object({
  email: z.string().email({ message: 'Email tidak valid' }),
});

type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resetComplete, setResetComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setMessage(null);
    setError(null);
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email);
      if (error) {
        setError(error.message);
      } else {
        setMessage('Link reset password telah dikirim ke email Anda.');
        setResetComplete(true);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
      {!resetComplete ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input
              id="email"
              type="email"
              className="w-full border rounded px-3 py-2"
              {...register('email')}
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Mengirim...' : 'Kirim Link Reset'}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>
      ) : (
        <div className="text-center">
          <p className="text-green-600 mb-4">{message}</p>
          <a href="/login" className="text-blue-600 hover:underline">Kembali ke Login</a>
        </div>
      )}
    </div>
  );
}