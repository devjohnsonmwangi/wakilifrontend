import { useEffect } from 'react';

interface AdResponsiveProps {
  adSlot: string;
  className?: string;
}

/**
 * Google AdSense Responsive Ad Component
 * Automatically adjusts to screen size and available space
 * Works on mobile and desktop
 * 
 * Usage:
 * <AdResponsive adSlot="1234567890" />
 */
export const AdResponsive = ({ 
  adSlot,
  className = '' 
}: AdResponsiveProps) => {
  
  useEffect(() => {
    // Push AdSense ads to page if script is loaded
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense responsive ad failed to load for slot:', adSlot);
      }
    }
  }, [adSlot]);

  return (
    <div className={`my-6 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5457373540838326"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdResponsive;
