import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 0.2, // Capture 20% of transactions for performance monitoring
  tracePropagationTargets: ["localhost", process.env.NEXT_PUBLIC_SITE_URL || "mmorpg-marketplace.vercel.app"],

  // Environment-specific configuration
  environment: process.env.NODE_ENV,
  release: process.env.NEXT_PUBLIC_VERSION || "development",

  // Capture specific transaction types
  beforeSend(event) {
    // Don't send events in development
    if (process.env.NODE_ENV === "development") {
      return null;
    }

    // Add marketplace-specific tags
    if (event.transaction) {
      // Tag important business transactions
      if (event.transaction.includes("/checkout")) {
        event.tags = {
          ...event.tags,
          flow: "checkout",
        };
      } else if (event.transaction.includes("/marketplace")) {
        event.tags = {
          ...event.tags,
          flow: "marketplace",
        };
      }
    }

    return event;
  },

  // Custom breadcrumbs for marketplace actions
  beforeBreadcrumb(breadcrumb) {
    // Add marketplace-specific context to navigation
    if (breadcrumb.category === "navigation") {
      if (breadcrumb.data?.to?.includes("/product/")) {
        breadcrumb.message = "Viewed Product";
      } else if (breadcrumb.data?.to?.includes("/cart")) {
        breadcrumb.message = "Viewed Cart";
      }
    }
    return breadcrumb;
  },
});