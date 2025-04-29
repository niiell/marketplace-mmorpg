import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({ params }: { params: { listingId: string } }) {
  return <CheckoutClient listingId={params.listingId} />;
}
