import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface ReviewFormProps {
  listingId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ listingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Silakan login terlebih dahulu');
        return;
      }

      const { error } = await supabase
        .from('reviews')
        .insert({
          listing_id: listingId,
          user_id: user.id,
          rating,
          comment
        });

      if (error) throw error;

      toast.success('Review berhasil ditambahkan');
      setComment('');
      setRating(5);
      onReviewSubmitted();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} Bintang
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Komentar
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={4}
          required
          minLength={10}
          maxLength={500}
          placeholder="Berikan komentar Anda..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
      </button>
    </form>
  );
}
