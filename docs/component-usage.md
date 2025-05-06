# Component Usage Documentation

This document provides usage guidelines for key React components in the Marketplace MMORPG project.

## Chat Components

- **ChatPageClient.tsx**: Client-side chat UI component handling real-time messaging.
- **ChatPageWrapper.tsx**: Client wrapper dynamically importing ChatPageClient with SSR disabled.
- **chat/[listing_id]/page.tsx**: Server component importing ChatPageWrapper.

## Checkout Components

- **CheckoutClient.tsx**: Client-side checkout form and logic.
- **CheckoutWrapper.tsx**: Client wrapper dynamically importing CheckoutClient with SSR disabled.
- **checkout/[listingId]/page.tsx**: Server component importing CheckoutWrapper.

## Listing Components

- **NewListingClient.tsx**: Client-side new listing form.
- **NewListingWrapper.tsx**: Client wrapper dynamically importing NewListingClient with SSR disabled.
- **listing/new/page.tsx**: Server component importing NewListingWrapper.

## Usage Notes

- Client wrappers are used to enable dynamic imports with `ssr: false` to avoid Next.js app router restrictions.
- Server components import client wrappers to maintain code splitting and performance.
- Components use Tailwind CSS for styling with design tokens defined in `tailwind.config.js`.
- Dark mode is enabled via Tailwind's class strategy; integration with a toggle component is recommended.

## Recommendations

- Use the client wrappers for any component requiring client-side only behavior or dynamic imports with SSR disabled.
- Follow Tailwind tokens for consistent spacing, colors, and typography.
- Document new components here as the project evolves.
