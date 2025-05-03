import Link from 'next/link';

export default function ChatButton({ listingId }: { listingId: number }) {
  return (
    <Link href={`/chat/${listingId}`}>
      <button
        aria-label="Chat dengan Penjual"
        tabIndex={0}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition"
      >
        Chat dengan Penjual
      </button>
    </Link>
  );
}
