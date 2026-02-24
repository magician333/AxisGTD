'use client';

import { useEffect } from 'react';

export default function NavbarAd() {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className="w-full my-4 flex justify-center overflow-hidden">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-8032561724273374"
        data-ad-slot="7220921686"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
