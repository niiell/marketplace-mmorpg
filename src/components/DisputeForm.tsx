'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface DisputeFormProps {
  listingId: string;
  onDisputeSubmitted: () => void;
}

export default function DisputeForm({ listingId, onDisputeSubmitted }: DisputeFormProps) {
  const [reason, setReason] = useState('');
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reasonValid, setReasonValid] = useState(true);

  useEffect(() => {
    setReasonValid(reason.length >= 10 && reason.length <= 1000);
  }, [reason]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEvidenceFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reasonValid) {
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

      let evidenceUrl: string | null = null;
      if (evidenceFile) {
        const fileExt = evidenceFile.name.split('.').pop();
        const fileName = `${user.id}_${Date.now()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.storage
          .from('dispute-evidence')
          .upload(fileName, evidenceFile);

        if (uploadError) throw uploadError;

        evidenceUrl = data?.path ?? null;
      }

      const { error } = await supabase
        .from('disputes')
        .insert({
          listing_id: listingId,
          user_id: user.id,
          reason,
          evidence_url: evidenceUrl,
          status: 'pending',
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast.success('Dispute berhasil diajukan');
      setReason('');
      setEvidenceFile(null);
      onDisputeSubmitted();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite" aria-relevant="additions">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
          Alasan Dispute
        </label>
        <motion.textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className={`block w-full rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 ${
            reasonValid ? 'border-gray-300' : 'border-red-500 ring-red-500'
          }`}
          rows={4}
          required
          minLength={10}
          maxLength={1000}
          placeholder="Jelaskan alasan dispute Anda..."
          aria-invalid={!reasonValid}
          aria-describedby="reason-error"
          whileFocus={{ scale: 1.02 }}
          whileHover={{ scale: 1.02 }}
        />
        <AnimatePresence>
          {!reasonValid && (
            <motion.p
              id="reason-error"
              className="text-red-500 text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="alert"
            >
              Alasan harus antara 10 sampai 1000 karakter.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div>
        <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
          Bukti Pendukung (opsional)
        </label>
        <input
          id="evidence"
          type="file"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          aria-describedby="evidence-help"
        />
        <p id="evidence-help" className="text-xs text-gray-500 mt-1">
          Upload bukti pendukung dalam format gambar atau PDF.
        </p>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
        whileHover={{ scale: 1.05, boxShadow: '0 0 8px rgb(220 38 38 / 0.7)' }}
        whileTap={{ scale: 0.95 }}
        whileFocus={{ scale: 1.05, boxShadow: '0 0 8px rgb(220 38 38 / 0.7)' }}
        aria-live="polite"
      >
        {isSubmitting ? 'Mengirim...' : 'Ajukan Dispute'}
      </motion.button>
    </form>
  );
}
