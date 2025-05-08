"use client";

import dynamic from "next/dynamic";

const ChatPageClient = dynamic(() => import("./ChatPageClient"), {
  ssr: false,
  loading: () => (
    <div className="text-center py-12">
      <p>Loading chat...</p>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  ),
});

export default function ChatPageWrapper() {
  return (
    <div className="container">
      <ChatPageClient />
    </div>
  );
}