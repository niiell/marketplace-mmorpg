"use client";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  useEffect(() => {
    // Log error ke monitoring jika perlu
    // console.error(error);
  }, [error]);

  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen bg-red-50">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Terjadi Error</h2>
        <p className="mb-2 text-red-600">{error?.message || "Unknown error"}</p>
        <pre className="text-xs text-gray-500 bg-gray-100 p-2 rounded max-w-xl overflow-x-auto">
          {error?.stack || "No stacktrace"}
        </pre>
        <button onClick={() => reset()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Coba Lagi</button>
      </body>
    </html>
  );
}
