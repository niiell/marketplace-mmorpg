import CheckoutWrapper from "./CheckoutWrapper";

export default async function CheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  const resolvedParams = await params;
  return <CheckoutWrapper listingId={resolvedParams.listingId} />;
}
