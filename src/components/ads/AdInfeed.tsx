import { useEffect } from 'react';

interface AdInfeedProps {
  adSlot: string;
  className?: string;
}

/**
 * Google AdSense In-Feed Ad Component
 * Use between content sections (between blog posts, articles, etc.)
 * Looks like native content
 * 
 * Usage:
 * <AdInfeed adSlot="1234567890" />
 */
export const AdInfeed = ({ 
  adSlot,
  className = '' 
}: AdInfeedProps) => {
  
  useEffect(() => {
    // Push AdSense ads to page if script is loaded
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense in-feed ad failed to load for slot:', adSlot);
      }
    }
  }, [adSlot]);

  return (
    <div className={`my-8 ${className}`}>
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

export default AdInfeed;
