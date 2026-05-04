import { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  adFormat?: 'auto' | 'vertical' | 'horizontal';
  className?: string;
}

/**
 * Google AdSense Banner Ad Component
 * Use this component to display horizontal banner ads (728x90, 970x90, etc.)
 * 
 * Usage:
 * <AdBanner adSlot="1234567890" adFormat="horizontal" />
 */
export const AdBanner = ({ 
  adSlot, 
  adFormat = 'horizontal',
  className = '' 
}: AdBannerProps) => {
  
  useEffect(() => {
    // Push AdSense ads to page if script is loaded
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense ad failed to load for slot:', adSlot);
      }
    }
  }, [adSlot]);

  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5457373540838326"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner;
