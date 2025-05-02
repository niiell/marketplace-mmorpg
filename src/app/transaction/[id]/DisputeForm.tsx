'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../styles/smoke-effect.css';

interface DisputeFormProps {
  transactionId: string;
  userId: string;
}

export default function DisputeForm({ transactionId, userId }: DisputeFormProps) {
  const [reason, setReason] = useState('');
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reasonValid, setReasonValid] = useState<boolean | null>(null);
  const [evidenceUrlValid, setEvidenceUrlValid] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (reason.trim().length === 0) {
      setReasonValid(null);
    } else if (reason.trim().length < 10) {
      setReasonValid(false);
    } else {
      setReasonValid(true);
    }
  }, [reason]);

  useEffect(() => {
    if (evidenceUrl.trim().length === 0) {
      setEvidenceUrlValid(null);
    } else {
      try {
        new URL(evidenceUrl);
        setEvidenceUrlValid(true);
      } catch {
        setEvidenceUrlValid(false);
      }
    }
  }, [evidenceUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (reasonValid === false || evidenceUrlValid === false) {
      setError('Please fix validation errors before submitting.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transaction_id: transactionId, user_id: userId, reason, evidence_url: evidenceUrl }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to submit dispute');
        setLoading(false);
        return;
      }

      router.refresh();
      alert('Dispute submitted successfully');
      setReason('');
      setEvidenceUrl('');
      setReasonValid(null);
      setEvidenceUrlValid(null);
    } catch (err) {
      setError('Failed to submit dispute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Report a Dispute</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <div className="mb-4">
        <label htmlFor="reason" className="block mb-1 font-medium">Reason</label>
        <textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          rows={4}
          className={`w-full border rounded p-2 transition ${
            reasonValid === true ? 'input-valid' : reasonValid === false ? 'input-error' : ''
          }`}
          placeholder="Describe the issue"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="evidenceUrl" className="block mb-1 font-medium">Evidence URL (optional)</label>
        <input
          id="evidenceUrl"
          type="url"
          value={evidenceUrl}
          onChange={(e) => setEvidenceUrl(e.target.value)}
          className={`w-full border rounded p-2 transition ${
            evidenceUrlValid === true ? 'input-valid' : evidenceUrlValid === false ? 'input-error' : ''
          }`}
          placeholder="Link to screenshots or chat logs"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 smoke-button"
      >
        {loading ? 'Submitting...' : 'Submit Dispute'}
      </button>
    </form>
  );
}
