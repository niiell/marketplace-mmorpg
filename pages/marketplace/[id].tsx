import { GetStaticPaths, GetStaticProps } from 'next';
import { supabase } from 'src/lib/supabase';
import Gallery from 'src/components/Gallery';
import ChatButton from 'src/components/ChatButton';
import BuyButton from 'src/components/BuyButton';

export default function ListingDetail({ listing, reviews }: any) {
  if (!listing) return <div>Not found</div>;

  // Calculate average rating
  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
    : null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="grid md:grid-cols-2 gap-8">
        <Gallery images={[listing.image_url]} />
        <div>
          <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
          <div className="text-blue-600 font-bold text-xl mb-2">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(listing.price)}
          </div>
          <p className="mb-4">{listing.description}</p>
          <div className="mb-4">
            <span className="font-semibold">Penjual:</span> {listing.seller_id}
          </div>
          <div className="flex gap-2 mb-4">
            <ChatButton listingId={listing.id} />
            <BuyButton listingId={listing.id} />
          </div>
        </div>
      </div>
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Ulasan</h2>
        {avgRating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-2">
              {'★'.repeat(Math.round(avgRating))}
              {'☆'.repeat(5 - Math.round(avgRating))}
            </span>
            <span className="text-sm text-gray-600">({reviews.length} ulasan)</span>
          </div>
        )}
        {reviews.length === 0 ? (
          <div>Belum ada ulasan.</div>
        ) : (
          <ul>
            {reviews.map((r: any) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ReviewCard component
function ReviewCard({ review }: { review: any }) {
  return (
    <li className="mb-2 border-b pb-2">
      <div className="font-semibold">Rating: {review.rating} ⭐</div>
      <div>{review.comment}</div>
    </li>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { data } = await supabase
    .from('listings')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(10);
  const paths = (data || []).map((l: any) => ({
    params: { id: l.id.toString() },
  }));
  return { paths, fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id;
  const { data: listing } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();
  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('transaction_id', id);
  return {
    props: {
      listing,
      reviews: reviews || [],
    },
    revalidate: 60,
  };
};
