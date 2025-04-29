import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  const resolvedParams = await params;
  return <CheckoutClient listingId={resolvedParams.listingId} />;
}
