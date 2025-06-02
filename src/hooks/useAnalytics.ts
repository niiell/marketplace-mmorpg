import { useCallback } from 'react';
import * as Sentry from '@sentry/nextjs';
import { supabase } from '../lib/supabase';

type AnalyticsEvent = {
  category: 'marketplace' | 'checkout' | 'user' | 'listing';
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
};

export function useAnalytics() {
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      // Track in Sentry for performance monitoring
      Sentry.addBreadcrumb({
        category: event.category,
        message: event.action,
        level: 'info',
        data: {
          label: event.label,
          value: event.value,
          ...event.metadata,
        },
      });

      // Store in Supabase for business analytics
      const { error } = await supabase.from('analytics_events').insert([{
        category: event.category,
        action: event.action,
        label: event.label,
        value: event.value,
        metadata: event.metadata,
        timestamp: new Date().toISOString(),
      }]);

      if (error) {
        console.error('Analytics error:', error);
        Sentry.captureException(error);
      }
    } catch (error) {
      console.error('Failed to track event:', error);
      Sentry.captureException(error);
    }
  }, []);

  const trackPageView = useCallback(async (path: string, title?: string) => {
    await trackEvent({
      category: 'user',
      action: 'page_view',
      label: title || path,
      metadata: { path }
    });
  }, [trackEvent]);

  const trackListingView = useCallback(async (listingId: string, title: string, price: number) => {
    await trackEvent({
      category: 'listing',
      action: 'view',
      label: title,
      value: price,
      metadata: { listingId }
    });
  }, [trackEvent]);

  const trackAddToCart = useCallback(async (listingId: string, quantity: number, price: number) => {
    await trackEvent({
      category: 'marketplace',
      action: 'add_to_cart',
      value: price * quantity,
      metadata: { listingId, quantity }
    });
  }, [trackEvent]);

  const trackCheckoutStep = useCallback(async (step: string, metadata?: Record<string, any>) => {
    await trackEvent({
      category: 'checkout',
      action: 'checkout_step',
      label: step,
      metadata
    });
  }, [trackEvent]);

  const trackPurchase = useCallback(async (transactionId: string, total: number, items: Array<{ id: string, quantity: number, price: number }>) => {
    await trackEvent({
      category: 'checkout',
      action: 'purchase',
      value: total,
      metadata: {
        transactionId,
        items
      }
    });
  }, [trackEvent]);

  const trackSearch = useCallback(async (query: string, resultCount: number) => {
    await trackEvent({
      category: 'marketplace',
      action: 'search',
      label: query,
      value: resultCount
    });
  }, [trackEvent]);

  const trackError = useCallback(async (error: Error, context?: Record<string, any>) => {
    await trackEvent({
      category: 'user',
      action: 'error',
      label: error.message,
      metadata: {
        ...context,
        stack: error.stack
      }
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageView,
    trackListingView,
    trackAddToCart,
    trackCheckoutStep,
    trackPurchase,
    trackSearch,
    trackError
  };
}