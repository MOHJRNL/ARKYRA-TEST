import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';

const N8nProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      api_key: '',
      base_url: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        api_key: string().min(1, 'API key is required'),
        base_url: string().url('Please enter a valid n8n instance URL'),
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
            label="n8n Instance URL"
            {...form.register('base_url')}
            placeholder="https://your-n8n-instance.com"
          />

          <Input
            label="n8n API Key"
            type="password"
            {...form.register('api_key')}
            placeholder="Enter your n8n API key"
          />

          <div className="text-sm text-gray-400 mb-4">
            Get your API key from your n8n instance settings
          </div>

          <Button type="submit">Connect n8n</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('n8n', N8nProviderComponent);
