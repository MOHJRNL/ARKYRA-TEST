import { SentryComponent } from '@gitroom/frontend/components/layout/sentry.component';

export const dynamic = 'force-dynamic';
import '../global.scss';
import '../../styles/arkyra-globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import '@copilotkit/react-ui/styles.css';
import LayoutContext from '@gitroom/frontend/components/layout/layout.context';
import { ReactNode } from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import PlausibleProvider from 'next-plausible';
import clsx from 'clsx';
import { VariableContextComponent } from '@gitroom/react/helpers/variable.context';
import { Fragment } from 'react';
import { PHProvider } from '@gitroom/react/helpers/posthog';
import UtmSaver from '@gitroom/helpers/utils/utm.saver';
import { DubAnalytics } from '@gitroom/frontend/components/layout/dubAnalytics';
import { FacebookComponent } from '@gitroom/frontend/components/layout/facebook.component';
import { headers } from 'next/headers';
import { headerName } from '@gitroom/react/translation/i18n.config';
import { HtmlComponent } from '@gitroom/frontend/components/layout/html.component';
import { alJazeeraArabic, jakartaSans } from '@gitroom/frontend/config/fonts';
// import dynamicLoad from 'next/dynamic';
// const SetTimezone = dynamicLoad(
//   () => import('@gitroom/frontend/components/layout/set.timezone'),
//   {
//     ssr: false,
//   }
// );

export default async function AppLayout({ children }: { children: ReactNode }) {
  const allHeaders = headers();
  const currentLanguage = allHeaders.get(headerName) || 'en';
  const isArabic = currentLanguage === 'ar';
  const Plausible = !!process.env.STRIPE_PUBLISHABLE_KEY
    ? PlausibleProvider
    : Fragment;
  return (
    <html className={clsx(alJazeeraArabic.variable, jakartaSans.variable)}>
      <head>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body
        className={clsx(
          isArabic ? 'font-[var(--font-al-jazeera-arabic)]' : jakartaSans.className,
          'dark text-primary !bg-primary'
        )}
      >
        <VariableContextComponent
          storageProvider={
            process.env.STORAGE_PROVIDER! as 'local' | 'cloudflare'
          }
          environment={process.env.NODE_ENV!}
          backendUrl={process.env.NEXT_PUBLIC_BACKEND_URL!}
          plontoKey={process.env.NEXT_PUBLIC_POLOTNO!}
          stripeClient={process.env.STRIPE_PUBLISHABLE_KEY!}
          billingEnabled={!!process.env.STRIPE_PUBLISHABLE_KEY}
          discordUrl={process.env.NEXT_PUBLIC_DISCORD_SUPPORT!}
          frontEndUrl={process.env.FRONTEND_URL!}
          isGeneral={!!process.env.IS_GENERAL}
          genericOauth={!!process.env.POSTIZ_GENERIC_OAUTH}
          oauthLogoUrl={process.env.NEXT_PUBLIC_ARKYRA_OAUTH_LOGO_URL!}
          oauthDisplayName={process.env.NEXT_PUBLIC_ARKYRA_OAUTH_DISPLAY_NAME!}
          uploadDirectory={process.env.NEXT_PUBLIC_UPLOAD_STATIC_DIRECTORY!}
          dub={!!process.env.STRIPE_PUBLISHABLE_KEY}
          facebookPixel={process.env.NEXT_PUBLIC_FACEBOOK_PIXEL!}
          telegramBotName={process.env.TELEGRAM_BOT_NAME!}
          neynarClientId={process.env.NEYNAR_CLIENT_ID!}
          isSecured={!process.env.NOT_SECURED}
          disableImageCompression={!!process.env.DISABLE_IMAGE_COMPRESSION}
          disableXAnalytics={!!process.env.DISABLE_X_ANALYTICS}
          sentryDsn={process.env.NEXT_PUBLIC_SENTRY_DSN!}
          language={allHeaders.get(headerName)}
          transloadit={
            process.env.TRANSLOADIT_AUTH && process.env.TRANSLOADIT_TEMPLATE
              ? [
                  process.env.TRANSLOADIT_AUTH!,
                  process.env.TRANSLOADIT_TEMPLATE!,
                ]
              : []
          }
        >
          <SentryComponent>
            {/*<SetTimezone />*/}
            <HtmlComponent />
            <DubAnalytics />
            <FacebookComponent />
            <Plausible
              domain={!!process.env.IS_GENERAL ? 'arkyra.pro' : 'gitroom.com'}
            >
              <PHProvider
                phkey={process.env.NEXT_PUBLIC_POSTHOG_KEY}
                host={process.env.NEXT_PUBLIC_POSTHOG_HOST}
              >
                <LayoutContext>
                  <UtmSaver />
                  {children}
                </LayoutContext>
              </PHProvider>
            </Plausible>
          </SentryComponent>
        </VariableContextComponent>
      </body>
    </html>
  );
}
