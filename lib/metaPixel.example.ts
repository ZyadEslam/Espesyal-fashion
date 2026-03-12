/**
 * Meta Pixel – example usage (do not import this file in production).
 * Use trackEvent from 'lib/metaPixel' in client components or after hydration.
 */

import { trackEvent, META_PIXEL_EVENTS } from './metaPixel';

// Purchase (e.g. on order confirmation / thank-you page)
trackEvent('Purchase', {
  value: 9.99,
  currency: 'USD',
});

// Optional: use constant for type-safe event names
trackEvent(META_PIXEL_EVENTS.Purchase, {
  value: 9.99,
  currency: 'USD',
});

// Other standard events
trackEvent(META_PIXEL_EVENTS.ViewContent, { content_name: 'Product Name' });
trackEvent(META_PIXEL_EVENTS.AddToCart, { content_name: 'Product Name', value: 19.99 });
trackEvent(META_PIXEL_EVENTS.InitiateCheckout, { value: 49.99, currency: 'USD' });
