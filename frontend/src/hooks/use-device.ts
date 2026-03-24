'use client';

import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDevice() {
  const [device, setDevice] = useState<{
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    deviceType: DeviceType;
  }>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    deviceType: 'desktop',
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      const isMobile = width < 768;
      const isTablet = width >= 768 && width < 1024;
      const isDesktop = width >= 1024;

      let deviceType: DeviceType = 'desktop';
      if (isMobile) deviceType = 'mobile';
      else if (isTablet) deviceType = 'tablet';

      setDevice({
        isMobile,
        isTablet,
        isDesktop,
        deviceType,
      });
    };

    // Initial check
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}
