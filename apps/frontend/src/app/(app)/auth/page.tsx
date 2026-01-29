import { internalFetch } from '@gitroom/helpers/utils/internal.fetch';
export const dynamic = 'force-dynamic';
import { Register } from '@gitroom/frontend/components/auth/register';
import { Metadata } from 'next';
import Link from 'next/link';
import { getT } from '@gitroom/react/translation/get.translation.service.backend';
import { LoginWithOidc } from '@gitroom/frontend/components/auth/login.with.oidc';
import { getBrandName } from '@gitroom/frontend/config/branding';
export const metadata: Metadata = {
  title: `${getBrandName()} Register`,
  description: '',
};
export default async function Auth(params: {searchParams: {provider: string}}) {
  const t = await getT();
  if (process.env.DISABLE_REGISTRATION === 'true') {
    const canRegister = (
      await (await internalFetch('/auth/can-register')).json()
    ).register;
    if (!canRegister && !params?.searchParams?.provider) {
      return (
        <>
          <LoginWithOidc />
          <div className="text-center py-6">
            <p className="text-gray-400 dark:text-gray-500 mb-4">
              {t('registration_is_disabled', 'Registration is disabled')}
            </p>
            <Link
              className="text-[#048FCC] hover:text-[#235170] dark:text-[#048FCC] dark:hover:text-[#F8AB0C] font-semibold transition-all duration-200 ease-in-out hover:underline decoration-2 underline-offset-4 inline-flex items-center gap-2"
              href="/auth/login"
            >
              {t('login_instead', 'Login instead')}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </>
      );
    }
  }
  return <Register />;
}
