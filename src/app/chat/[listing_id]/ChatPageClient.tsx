"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from '../../../lib/supabase';
import useSWR from "swr";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const fetcher = async (listing_id: string) => {
  // Get chat room for this listing and current user
  const { data: userData } = await supabase.auth.getUser();
  const user_id = userData.user?.id;
  if (!user_id) return { chat: null, messages: [] };
  const { data: chat } = await supabase
    .from("chats")
    .select("id")
    .eq("listing_id", listing_id)
    .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
    .single();
  if (!chat) return { chat: null, messages: [] };
  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, content, created_at")
    .eq("chat_id", chat.id)
    .order("created_at", { ascending: true });
  return { chat, messages: messages || [] };
};

export default function ChatPage() {
  const params = useParams();
  const listing_id = Array.isArray(params?.listing_id) ? params.listing_id[0] : params?.listing_id;
  const [unread, setUnread] = useState(0);
  const { register, handleSubmit, reset } = useForm();
  const [sending, setSending] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch chat & messages
  const { data, mutate } = useSWR(listing_id, fetcher, { refreshInterval: 0 });

  // Get current user id
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id || null));
  }, []);

  // Subscribe to realtime messages
  useEffect(() => {
    if (!data?.chat) return;
    const channel = supabase
      .channel(`chat-messages-${data.chat.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${data.chat.id}` },
        (payload) => {
          mutate();
          setUnread((u) => u + 1);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [data?.chat, mutate]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    setUnread(0);
  }, [data?.messages?.length]);

  // Send message
  const onSend = async (form: any) => {
    if (!form.content || !data?.chat || !userId) return;
    setSending(true);
    const { error } = await supabase.from("messages").insert({
      chat_id: data.chat.id,
      sender_id: userId,
      content: form.content,
    });
    setSending(false);
    if (error) toast.error("Gagal mengirim pesan");
    else {
      reset();
      // Send message to AI chatbot API
      try {
        const response = await fetch("/api/chatbot", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: form.content }),
        });
        const json = await response.json();
        if (json.message) {
          // Insert AI response as a message from system (sender_id = 0)
          await supabase.from("messages").insert({
            chat_id: data.chat.id,
            sender_id: 0,
            content: json.message,
          });
          mutate();
        } else if (json.error) {
          toast.error("AI Chatbot error: " + json.error);
        }
      } catch (err) {
        toast.error("Failed to get AI response");
      }
    }
  };

  if (!data) return <div className="text-center py-12">Loading chat...</div>;
  if (!data.chat) return <div className="text-center py-12">Chat tidak ditemukan.</div>;

  return (
    <div className="max-w-lg mx-auto flex flex-col h-[80vh] border rounded shadow bg-white">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50">
        <span className="font-bold text-blue-900">Chat Transaksi</span>
        {unread > 0 && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 ml-2">{unread}</span>}
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 bg-blue-50">
        {data.messages.map((msg: any) => (
          <div key={msg.id} className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-2xl px-4 py-2 max-w-[70%] text-sm shadow ${msg.sender_id === userId ? 'bg-blue-600 text-white' : 'bg-white text-blue-900 border'}`}>
              {msg.content}
              <div className="text-[10px] text-right mt-1 opacity-60">{new Date(msg.created_at).toLocaleTimeString()}</div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={handleSubmit(onSend)} className="flex gap-2 p-3 border-t bg-white">
        <input
          type="text"
          {...register("content")}
          placeholder="Ketik pesan..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none"
          autoComplete="off"
        />
        <button type="submit" disabled={sending} className="bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition">
          Kirim
        </button>
      </form>
    </div>
  );
}
