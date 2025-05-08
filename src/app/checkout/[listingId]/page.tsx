import CheckoutWrapper from "./CheckoutWrapper";

export default async function CheckoutPage({ params }: { params: Promise<{ listingId: string }> }) {
  try {
    const resolvedParams = await params;
    return <CheckoutWrapper listingId={resolvedParams.listingId} />;
  } catch (error) {
    console.error("Error resolving params:", error);
    return <div>Error resolving params</div>;
  }
}