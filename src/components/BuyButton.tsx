import Link from 'next/link';
import '../styles/smoke-effect.css';

export default function BuyButton({ listingId }: { listingId: number }) {
  return (
    <Link href={`/checkout/${listingId}`}>
      <button
        aria-label="Beli Sekarang"
        tabIndex={0}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition relative overflow-visible focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 smoke-button"
        type="button"
      >
        Beli Sekarang
      </button>
    </Link>
  );
}