import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { supabase } from '../src/lib/supabaseClient';

interface ReviewFormProps {
  listingId: number;
  reviewerId: string;
  revieweeId: string;
  transactionId: number;
  onSubmitted?: () => void;
}

export default function ReviewForm({ listingId, reviewerId, revieweeId, transactionId, onSubmitted }: ReviewFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<{ rating: number; comment: string }>();
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data: { rating: number; comment: string }) => {
    setSuccess('');
    setError('');
    const { error } = await supabase.from('reviews').insert({
      reviewer_id: reviewerId,
      reviewee_id: revieweeId,
      listing_id: listingId,
      transaction_id: transactionId,
      rating: data.rating,
      comment: data.comment,
    });
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Review submitted!');
      reset();
      onSubmitted && onSubmitted();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 mt-6">
      <div>
        <label className="block mb-1 font-medium">Rating</label>
        <select {...register('rating', { required: true, min: 1, max: 5 })} className="border rounded px-2 py-1">
          <option value="">Pilih rating</option>
          {[1,2,3,4,5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
        </select>
        {errors.rating && <div className="text-red-600 text-sm">Rating wajib diisi (1-5)</div>}
      </div>
      <div>
        <label className="block mb-1 font-medium">Komentar</label>
        <textarea {...register('comment', { required: true })} className="border rounded px-2 py-1 w-full" rows={3} />
        {errors.comment && <div className="text-red-600 text-sm">Komentar wajib diisi</div>}
      </div>
      <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
        {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
      </button>
      {success && <div className="text-green-600 text-sm mt-2">{success}</div>}
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </form>
  );
}
