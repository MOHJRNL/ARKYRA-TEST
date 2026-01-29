import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';

const ZapierProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      api_key: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        api_key: string().min(1, 'API key is required'),
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
            label="Zapier API Key"
            type="password"
            {...form.register('api_key')}
            placeholder="Enter your Zapier API key"
          />

          <div className="text-sm text-gray-400 mb-4">
            Get your API key from{' '}
            <a
              href="https://zapier.com/app/settings/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forth underline"
            >
              Zapier Settings
            </a>
          </div>

          <Button type="submit">Connect Zapier</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('zapier', ZapierProviderComponent);
