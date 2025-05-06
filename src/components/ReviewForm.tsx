'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ReviewFormProps {
  listingId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ listingId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ratingValid, setRatingValid] = useState(true);
  const [commentValid, setCommentValid] = useState(true);

  useEffect(() => {
    setRatingValid(rating >= 1 && rating <= 5);
  }, [rating]);

  useEffect(() => {
    setCommentValid(comment.length >= 10 && comment.length <= 500);
  }, [comment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ratingValid || !commentValid) {
      toast.error('Mohon perbaiki input yang salah');
      return;
    }
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Silakan login terlebih dahulu');
        setIsSubmitting(false);
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
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div>
        <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
          Rating
        </label>
        <motion.select
          id="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
            ratingValid ? 'border-gray-300' : 'border-red-500 ring-red-500'
          }`}
          required
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: 1.02 }}
        >
          {[5, 4, 3, 2, 1].map((value) => (
            <option key={value} value={value}>
              {value} Bintang
            </option>
          ))}
        </motion.select>
        <AnimatePresence>
          {!ratingValid && (
            <motion.p
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Rating harus antara 1 sampai 5.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      
      <div>
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
          Komentar
        </label>
        <motion.textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
            commentValid ? 'border-gray-300' : 'border-red-500 ring-red-500'
          }`}
          rows={4}
          required
          minLength={10}
          maxLength={500}
          placeholder="Berikan komentar Anda..."
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: 1.02 }}
        />
        <AnimatePresence>
          {!commentValid && (
            <motion.p
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Komentar harus antara 10 sampai 500 karakter.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgb(59 130 246 / 0.7)' }}
        whileTap={{ scale: 0.95 }}
        whileFocus={{ scale: 1.05, boxShadow: '0 0 8px rgb(59 130 246 / 0.7)' }}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
      </motion.button>
    </motion.form>
  );
}
