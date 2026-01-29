import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';

const AmplitudeProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      api_key: '',
      secret_key: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        api_key: string().min(1, 'API key is required'),
        secret_key: string().min(1, 'Secret key is required'),
      })
    ),
  });

  const submit: SubmitHandler<any> = useCallback(
    async (params) => {
      thirdParty.onChange(await send(params));
      thirdParty.close();
    },
    []
  );

  return (
    <div>
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submit)}
          className="w-full flex flex-col"
        >
          <Input
            label="Amplitude API Key"
            type="password"
            {...form.register('api_key')}
            placeholder="Enter your Amplitude API key"
          />

          <Input
            label="Secret Key"
            type="password"
            {...form.register('secret_key')}
            placeholder="Enter your Amplitude secret key"
          />

          <div className="text-sm text-gray-400 mb-4">
            Find your API credentials in{' '}
            <a
              href="https://analytics.amplitude.com/settings/projects"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forth underline"
            >
              Amplitude Settings
            </a>
          </div>

          <Button type="submit">Connect Amplitude</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('amplitude', AmplitudeProviderComponent);
