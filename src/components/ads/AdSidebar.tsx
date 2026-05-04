import { useEffect } from 'react';

interface AdSidebarProps {
  adSlot: string;
  className?: string;
}

/**
 * Google AdSense Sidebar Ad Component
 * Use this for sidebar vertical ads (300x600, 300x250, etc.)
 * 
 * Usage:
 * <AdSidebar adSlot="1234567890" />
 */
export const AdSidebar = ({ 
  adSlot,
  className = '' 
}: AdSidebarProps) => {
  
  useEffect(() => {
    // Push AdSense ads to page if script is loaded
    if (typeof (window as any).adsbygoogle !== 'undefined') {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.log('AdSense sidebar ad failed to load for slot:', adSlot);
      }
    }
  }, [adSlot]);

  return (
    <div className={`sticky top-4 ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'inline-block',
          width: '300px',
          height: '600px'
        }}
        data-ad-client="ca-pub-5457373540838326"
        data-ad-slot={adSlot}
        data-ad-format="vertical"
        data-full-width-responsive="false"
      />
    </div>
  );
};

export default AdSidebar;
