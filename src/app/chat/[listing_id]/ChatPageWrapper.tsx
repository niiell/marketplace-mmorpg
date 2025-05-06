"use client";

import dynamic from "next/dynamic";

const ChatPageClient = dynamic(() => import("./ChatPageClient"), {
  ssr: false,
  loading: () => <div className="text-center py-12">Loading chat...</div>,
});

export default function ChatPageWrapper() {
  return <ChatPageClient />;
}
