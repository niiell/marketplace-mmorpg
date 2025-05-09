import React, { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { List, AutoSizer } from 'react-virtualized';
import SkeletonLoader from './SkeletonLoader';
import '../styles/smoke-effect.css';
import { useReducedMotion } from 'framer-motion';

interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  created_at: string;
}

interface ChatRoomProps {
  chatId: number;
  currentUserId: number;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inputValid, setInputValid] = useState<boolean | null>(null);
  const listRef = useRef<List>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: true });
        if (error) {
          console.error(error);
        } else if (data) {
          setMessages(data as Message[]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId]);

  useEffect(() => {
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [chatId]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const { count, error } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chatId)
          .neq('sender_id', currentUserId);
        if (error) {
          console.error(error);
        } else if (typeof count === 'number') {
          setUnreadCount(count);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchUnread();
  }, [chatId, currentUserId, messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    try {
      await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: currentUserId,
        content: input,
      });
      setInput('');
      setInputValid(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.trim().length === 0) {
      setInputValid(null);
    } else if (value.trim().length < 3) {
      setInputValid(false);
    } else {
      setInputValid(true);
    }
  };

  const rowRenderer = useCallback(
    ({ index, key, style }: { index: number; key: string; style: React.CSSProperties }) => {
      const msg = messages[index];
      const isMine = msg.sender_id === currentUserId;
      return (
        <div
          key={key}
          style={style}
          className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}
        >
          <div
            className={`rounded px-3 py-2 max-w-xs break-words ${
              isMine ? 'bg-green-200 text-right' : 'bg-gray-200 text-left'
            }`}
          >
            {msg.content}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.created_at).toLocaleTimeString()}
            </div>
          </div>
        </div>
      );
    },
    [messages, currentUserId]
  );

  useEffect(() => {
    if (listRef.current && !shouldReduceMotion) {
      listRef.current.scrollToRow(messages.length - 1);
    }
  }, [messages, shouldReduceMotion]);

  return (
    <div className="flex flex-col h-full w-full max-w-lg mx-auto border rounded shadow bg-white">
      <div className="flex items-center justify-between p-3 border-b">
        <span className="font-semibold">Chat Room</span>
        {unreadCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2">
            {unreadCount} Unread
          </span>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-2">
            <SkeletonLoader height="1.5rem" className="w-3/4" />
            <SkeletonLoader height="1.5rem" className="w-1/2" />
            <SkeletonLoader height="1.5rem" className="w-2/3" />
          </div>
        ) : (
          <AutoSizer>
            {({ height, width }: { height: number; width: number }) => (
              <List
                ref={listRef}
                width={width}
                height={height}
                rowCount={messages.length}
                rowHeight={70}
                rowRenderer={rowRenderer}
                overscanRowCount={5}
              />
            )}
          </AutoSizer>
        )}
      </div>
      <div className="flex p-3 border-t gap-2">
        <input
          className={`flex-1 border rounded px-3 py-2 transition ${
            inputValid === true ? 'input-valid' : inputValid === false ? 'input-error' : ''
          }`}
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded smoke-button"
          onClick={sendMessage}
          disabled={!inputValid}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
