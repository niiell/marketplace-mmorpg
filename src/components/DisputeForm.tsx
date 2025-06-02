"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SmokeButton } from "./SmokeButton";

interface DisputeFormProps {
  listingId: string;
  onDisputeSubmitted: () => void;
}

export default function DisputeForm({ listingId, onDisputeSubmitted }: DisputeFormProps) {
  const [reason, setReason] = useState("");
  const [evidence, setEvidence] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [touched, setTouched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setError("Please provide a reason for the dispute");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("listingId", listingId);
      formData.append("reason", reason);
      if (evidence) {
        formData.append("evidence", evidence);
      }

      // TODO: Implement actual dispute submission logic here
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      setSuccess(true);
      setReason("");
      setEvidence(null);
      onDisputeSubmitted();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-green-800 dark:text-green-200"
            role="alert"
          >
            <p>Your dispute has been submitted successfully. Our team will review it shortly.</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            onSubmit={handleSubmit}
            className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
            aria-label="Dispute submission form"
          >
            <div className="space-y-2">
              <label 
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Reason for Dispute
                <span className="text-red-500 ml-1" aria-hidden="true">*</span>
              </label>
              <div className="relative">
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    setTouched(true);
                  }}
                  rows={4}
                  className={`w-full px-4 py-2 rounded-lg border
                    ${error && touched ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}
                    bg-white dark:bg-gray-800 
                    text-gray-900 dark:text-white 
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 
                    focus:border-transparent transition-colors duration-200`}
                  placeholder="Please describe your issue in detail..."
                  aria-required="true"
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "reason-error" : undefined}
                />
                <motion.div
                  initial={false}
                  animate={{ opacity: reason.length > 0 ? 1 : 0 }}
                  className="absolute top-2 right-2"
                >
                  <svg 
                    className="w-5 h-5 text-green-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </motion.div>
              </div>
              {error && touched && (
                <motion.p
                  id="reason-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-600 dark:text-red-400 text-sm"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="evidence"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Supporting Evidence (Optional)
                <span className="text-xs text-gray-500 ml-2">(Images or documents)</span>
              </label>
              <div className="relative">
                <input
                  id="evidence"
                  type="file"
                  onChange={(e) => setEvidence(e.target.files?.[0] || null)}
                  accept="image/*,.pdf,.doc,.docx"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                    bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                    focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                    focus:border-transparent transition-colors duration-200"
                  aria-describedby="evidence-hint"
                />
              </div>
              <p 
                id="evidence-hint" 
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                Accepted formats: Images, PDF, DOC. Max size: 10MB
              </p>
            </div>

            <div className="flex justify-end">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  px-6 py-2 rounded-lg font-medium text-white
                  ${loading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'}
                  transition-colors duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                `}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Submitting...</span>
                  </span>
                ) : (
                  'Submit Dispute'
                )}
              </motion.button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}