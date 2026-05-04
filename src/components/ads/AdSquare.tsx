import { useEffect } from 'react';

interface AdSquareProps {
  adSlot: string;
  className?: string;
}

/**
 * Google AdSense Square Ad Component
 * Use this for medium rectangle ads (300x250)
 * Best for between content sections
 * 
 * Usage:
 * <AdSquare adSlot="1234567890" />
 */
export const AdSquare = ({ 
  adSlot,
  className = '' 
}: AdSquareProps) => {
  
  useEffect(() => {
    // Push AdSense ads to page if script is loaded
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense square ad failed to load for slot:', adSlot);
      }
    }
  }, [adSlot]);

  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'inline-block',
          width: '300px',
          height: '250px'
        }}
        data-ad-client="ca-pub-5457373540838326"
        data-ad-slot={adSlot}
        data-ad-format="auto"
      />
    </div>
  );
};

export default AdSquare;
