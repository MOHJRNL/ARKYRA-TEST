'use client';
import React from 'react';
import Image from 'next/image';
import { getBrandingConfig } from '@gitroom/frontend/config/branding';

export const Logo = () => {
  const branding = getBrandingConfig();

  return (
    <div className="mt-[12px] mb-[12px] min-w-[80px] flex items-center justify-center bg-transparent">
      <Image
        src={branding.logo.light}
        alt={branding.displayName}
        width={80}
        height={80}
        className="w-[80px] h-[80px] object-contain bg-transparent"
        priority
        unoptimized
        style={{
          backgroundColor: 'transparent',
          mixBlendMode: 'normal',
        }}
      />
    </div>
  );
};
