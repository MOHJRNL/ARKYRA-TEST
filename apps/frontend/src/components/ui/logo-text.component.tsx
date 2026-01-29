'use client';
import React from 'react';
import Image from 'next/image';
import { getBrandingConfig } from '@gitroom/frontend/config/branding';

export const LogoTextComponent = () => {
  const branding = getBrandingConfig();

  return (
    <div className="flex items-center justify-center gap-2 bg-transparent">
      <Image
        src={branding.logo.light}
        alt={branding.displayName}
        width={120}
        height={120}
        className="h-[120px] w-[120px] object-contain bg-transparent"
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
