/**
 * Meta Pixel (Facebook Pixel) tracking utility.
 * Use trackEvent() from client components or after fbq is loaded.
 */

declare global {
  interface Window {
    fbq?: (
      action: string,
      eventName: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Standard Meta Pixel event names for type safety and reuse.
 */
export const META_PIXEL_EVENTS = {
  PageView: 'PageView',
  ViewContent: 'ViewContent',
  AddToCart: 'AddToCart',
  InitiateCheckout: 'InitiateCheckout',
  Purchase: 'Purchase',
} as const;

export type MetaPixelEventName = (typeof META_PIXEL_EVENTS)[keyof typeof META_PIXEL_EVENTS];

/**
 * Safely track a custom or standard Meta Pixel event.
 * No-ops when window or fbq is not available (SSR, ad-blockers, or pixel not loaded).
 *
 * @example Purchase (order confirmation page)
 * trackEvent('Purchase', { value: 9.99, currency: 'USD' });
 *
 * @example ViewContent (product page)
 * trackEvent(META_PIXEL_EVENTS.ViewContent, { content_name: 'Product Name' });
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  if (typeof window.fbq !== 'function') return;

  if (params && Object.keys(params).length > 0) {
    window.fbq('track', eventName, params);
  } else {
    window.fbq('track', eventName);
  }
}
