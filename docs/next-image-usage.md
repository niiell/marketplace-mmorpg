# Using next/image for Optimized Images in Marketplace MMORPG

This document provides examples and guidelines for using the `next/image` component in the Marketplace MMORPG project to improve image loading performance and SEO.

## Why Use next/image?

- Automatic image optimization (resizing, format conversion)
- Lazy loading by default
- Responsive images with srcset support
- Better Core Web Vitals (LCP, CLS)

## Basic Usage Example

Replace standard `<img>` tags with the `Image` component from `next/image`.

```tsx
import Image from 'next/image';

export default function ListingCard() {
  return (
    <div>
      <Image
        src="/public/listing-image.jpg"
        alt="Listing Image"
        width={600}
        height={400}
        priority={true} // for above-the-fold images
      />
    </div>
  );
}
```

## Responsive Images

You can use layout="responsive" to make images scale with their container.

```tsx
<Image
  src="/public/listing-image.jpg"
  alt="Listing Image"
  width={600}
  height={400}
  layout="responsive"
/>
```

## Optimizing Marketplace Listing Images

In `pages/marketplace/[id].tsx` or relevant components, replace `<img>` tags with `next/image` and specify width and height for better performance.

## Notes

- Ensure all images are in the `public` directory or use remote image domains configured in `next.config.ts`.
- Update `next.config.ts` to allow external image domains if needed:

```ts
// next.config.ts
const nextConfig = {
  images: {
    domains: ['example.com', 'cdn.example.com'],
  },
};

export default nextConfig;
```

## References

- [Next.js Image Component Documentation](https://nextjs.org/docs/api-reference/next/image)
- [Core Web Vitals and Image Optimization](https://web.dev/fast/#images)
