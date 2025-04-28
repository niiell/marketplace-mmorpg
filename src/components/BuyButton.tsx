import Link from 'next/link';

export default function BuyButton({ listingId }: { listingId: number }) {
  return (
    <Link href={`/checkout/${listingId}`}>
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition">
        Beli Sekarang
      </button>
    </Link>
  );
}