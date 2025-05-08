# Component Usage Documentation

This document provides usage guidelines for key React components in the Marketplace MMORPG project.

## Table of Contents

* [Chat Components](#chat-components)
* [Checkout Components](#checkout-components)
* [Listing Components](#listing-components)
* [Usage Notes](#usage-notes)
* [Recommendations](#recommendations)

## Chat Components

### Client-Side Chat UI

* **ChatPageClient.tsx**: Handles real-time messaging.
* **ChatPageWrapper.tsx**: Dynamically imports ChatPageClient with SSR disabled.
* **chat/[listing_id]/page.tsx**: Server component importing ChatPageWrapper.

## Checkout Components

### Client-Side Checkout Form

* **CheckoutClient.tsx**: Handles checkout form and logic.
* **CheckoutWrapper.tsx**: Dynamically imports CheckoutClient with SSR disabled.
* **checkout/[listingId]/page.tsx**: Server component importing CheckoutWrapper.

## Listing Components

### Client-Side New Listing Form

* **NewListingClient.tsx**: Handles new listing form.
* **NewListingWrapper.tsx**: Dynamically imports NewListingClient with SSR disabled.
* **listing/new/page.tsx**: Server component importing NewListingWrapper.

## Usage Notes

* Client wrappers enable dynamic imports with `ssr: false` to avoid Next.js app router restrictions.
* Server components import client wrappers to maintain code splitting and performance.
* Components use Tailwind CSS for styling with design tokens defined in `tailwind.config.js`.
* Dark mode is enabled via Tailwind's class strategy; integration with a toggle component is recommended.

## Recommendations

* Use client wrappers for components requiring client-side only behavior or dynamic imports with SSR disabled.
* Follow Tailwind tokens for consistent spacing, colors, and typography.
* Document new components here as the project evolves.