import Link from 'next/link';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/solid';

export default function ChatButton({ listingId }: { listingId: number }) {
  return (
    <Link href={`/chat/${listingId}`} aria-label="Chat dengan Penjual">
      <button
        tabIndex={0}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition flex items-center gap-2"
      >
        <ChatBubbleLeftRightIcon className="w-5 h-5" aria-hidden="true" />
        Chat dengan Penjual
      </button>
    </Link>
  );
}
