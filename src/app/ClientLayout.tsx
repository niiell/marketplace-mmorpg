"use client";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import Navbar from '../components/Navbar';
import { initializeAxe } from '../utils/axe-core';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong:</h2>
      <pre className="text-sm bg-red-50 p-4 rounded">{error.message}</pre>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAxe();
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Navbar />
        <main>{children}</main>
      </div>
    </ErrorBoundary>
  );
}
