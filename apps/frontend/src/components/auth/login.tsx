'use client';

import { useForm, SubmitHandler, FormProvider } from 'react-hook-form';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import Link from 'next/link';
import { Button } from '@gitroom/react/form/button';
import { Input } from '@gitroom/react/form/input';
import { useMemo, useState } from 'react';
import { classValidatorResolver } from '@hookform/resolvers/class-validator';
import { LoginUserDto } from '@gitroom/nestjs-libraries/dtos/auth/login.user.dto';
import { GithubProvider } from '@gitroom/frontend/components/auth/providers/github.provider';
import { OauthProvider } from '@gitroom/frontend/components/auth/providers/oauth.provider';
import { GoogleProvider } from '@gitroom/frontend/components/auth/providers/google.provider';
import { useVariables } from '@gitroom/react/helpers/variable.context';
import { FarcasterProvider } from '@gitroom/frontend/components/auth/providers/farcaster.provider';
import WalletProvider from '@gitroom/frontend/components/auth/providers/wallet.provider';
import { useT } from '@gitroom/react/translation/get.transation.service.client';
type Inputs = {
  email: string;
  password: string;
  providerToken: '';
  provider: 'LOCAL';
};
export function Login() {
  const t = useT();
  const [loading, setLoading] = useState(false);
  const [notActivated, setNotActivated] = useState(false);
  const { isGeneral, neynarClientId, billingEnabled, genericOauth } =
    useVariables();
  const resolver = useMemo(() => {
    return classValidatorResolver(LoginUserDto);
  }, []);
  const form = useForm<Inputs>({
    resolver,
    defaultValues: {
      providerToken: '',
      provider: 'LOCAL',
    },
  });
  const fetchData = useFetch();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    setNotActivated(false);
    const login = await fetchData('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        provider: 'LOCAL',
      }),
    });
    if (login.status === 400) {
      const errorMessage = await login.text();
      if (errorMessage === 'User is not activated') {
        setNotActivated(true);
      } else {
        form.setError('email', {
          message: errorMessage,
        });
      }
      setLoading(false);
    }
  };
  return (
    <FormProvider {...form}>
      <form className="flex-1 flex" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col flex-1">
          <div className="mb-2">
            <h1 className="text-[42px] font-[600] -tracking-[0.8px] text-start bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('sign_in', 'Sign In')}
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Welcome back! Please enter your details.
            </p>
          </div>
          <div className="text-[14px] font-medium text-gray-300 mt-[32px] mb-[12px]">
            {t('continue_with', 'Continue With')}
          </div>
          <div className="flex flex-col">
            {isGeneral && genericOauth ? (
              <OauthProvider />
            ) : !isGeneral ? (
              <GithubProvider />
            ) : (
              <div className="gap-[8px] flex">
                <GoogleProvider />
                {!!neynarClientId && <FarcasterProvider />}
                {billingEnabled && <WalletProvider />}
              </div>
            )}
            <div className="h-[20px] mb-[24px] mt-[24px] relative">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-600 to-transparent top-[50%] -translate-y-[50%]" />
              <div
                className={`absolute z-[1] justify-center items-center w-full start-0 -top-[4px] flex`}
              >
                <div className="px-[16px] bg-newBgColorInner text-textColor opacity-60 text-xs font-medium uppercase tracking-wider">{t('or', 'or')}</div>
              </div>
            </div>
            <div className="flex flex-col gap-[12px]">
              <div className="text-textColor">
                <Input
                  label="Email"
                  translationKey="label_email"
                  {...form.register('email')}
                  type="email"
                  placeholder={t('email_address', 'Email Address')}
                />
                <Input
                  label="Password"
                  translationKey="label_password"
                  {...form.register('password')}
                  autoComplete="off"
                  type="password"
                  placeholder={t('label_password', 'Password')}
                />
              </div>
              {notActivated && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-[10px] p-4 mb-4">
                  <p className="text-amber-400 text-sm mb-3 leading-relaxed">
                    {t(
                      'account_not_activated',
                      'Your account is not activated yet. Please check your email for the activation link.'
                    )}
                  </p>
                  <Link
                    href="/auth/activate"
                    className="text-amber-400 hover:text-amber-300 font-semibold text-sm transition-colors duration-200 inline-flex items-center gap-2 underline decoration-2 underline-offset-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {t('resend_activation_email', 'Resend Activation Email')}
                  </Link>
                </div>
              )}
              <div className="text-center mt-6">
                <div className="w-full flex">
                  <Button
                    type="submit"
                    className="flex-1 rounded-[10px] !h-[52px]"
                    loading={loading}
                  >
                    {t('sign_in_1', 'Sign in')}
                  </Button>
                </div>
                <div className="mt-6 space-y-4">
                  <p className="text-[15px] font-medium">
                    <span className="text-gray-400 dark:text-gray-500">
                      {t('don_t_have_an_account', "Don't Have An Account?")}
                    </span>
                    &nbsp;
                    <Link
                      href="/auth"
                      className="text-[#048FCC] hover:text-[#235170] dark:text-[#048FCC] dark:hover:text-[#F8AB0C] font-semibold transition-all duration-200 ease-in-out hover:underline decoration-2 underline-offset-4 cursor-pointer"
                    >
                      {t('sign_up', 'Sign Up')}
                    </Link>
                  </p>
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-700 dark:border-gray-600"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-newBgColorInner px-4 text-textColor opacity-60 text-xs uppercase tracking-wider">
                        {t('or', 'or')}
                      </span>
                    </div>
                  </div>
                  <p className="text-[15px]">
                    <Link
                      href="/auth/forgot"
                      className="text-[#048FCC] hover:text-[#235170] dark:text-[#048FCC] dark:hover:text-[#F8AB0C] font-semibold transition-all duration-200 ease-in-out hover:underline decoration-2 underline-offset-4 cursor-pointer inline-flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      {t('forgot_password', 'Forgot password?')}
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
