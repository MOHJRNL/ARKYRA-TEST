import { getT } from '@gitroom/react/translation/get.translation.service.backend';

export const dynamic = 'force-dynamic';
import { ReactNode } from 'react';
import Image from 'next/image';
import loadDynamic from 'next/dynamic';
import { TestimonialComponent } from '@gitroom/frontend/components/auth/testimonial.component';
import { LogoTextComponent } from '@gitroom/frontend/components/ui/logo-text.component';
import { getBrandingConfig } from '@gitroom/frontend/config/branding';
const ReturnUrlComponent = loadDynamic(() => import('./return.url.component'));
export default async function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getT();
  const branding = getBrandingConfig();

  return (
    <div className="bg-newBgColor flex flex-1 p-[12px] gap-[12px] min-h-screen w-screen text-textColor">
      {/*<style>{`html, body {overflow-x: hidden;}`}</style>*/}
      <ReturnUrlComponent />
      <div className="flex flex-col py-[40px] px-[20px] flex-1 lg:w-[600px] lg:flex-none rounded-[12px] text-textColor p-[12px] bg-newBgColorInner">
        <div className="w-full max-w-[440px] mx-auto justify-center gap-[20px] h-full flex flex-col text-textColor">
          <LogoTextComponent />
          <div className="flex">{children}</div>
        </div>
      </div>
      <div className="text-[36px] flex-1 pt-[88px] hidden lg:flex flex-col items-center text-textColor">
        <div className="text-center">
          Over <span className="text-[42px] text-[#F8AB0C]">20,000+</span>{' '}
          Enterprises use
          <br />
          {branding.displayName} To Grow Their Social Presence
        </div>
        <TestimonialComponent />
      </div>
    </div>
  );
}
