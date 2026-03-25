'use client';

import Script from 'next/script';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const META_PIXEL_SCRIPT = 'https://connect.facebook.net/en_US/fbevents.js';

export default function MetaPixel() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pixelReady, setPixelReady] = useState(false);

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  useEffect(() => {
    if (!pixelReady || typeof window === 'undefined' || typeof window.fbq !== 'function') {
      return;
    }
    window.fbq('track', 'PageView');
  }, [pixelReady, pathname, searchParams]);

  const handleScriptLoad = () => {
    if (typeof window === 'undefined' || !pixelId) return;
    window.fbq?.('init', pixelId);
    setPixelReady(true);
  };

  if (!pixelId) {
    return null;
  }

  return (
    <>
      <Script
        src={META_PIXEL_SCRIPT}
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />
      <noscript>
        <Image
          height={1}
          width={1}
          style={{ display: 'none' }}
          alt=""
          unoptimized
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
