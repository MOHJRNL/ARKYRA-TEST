import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';
import { Textarea } from '@gitroom/react/form/textarea';

const WebhooksProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      url: '',
      secret: '',
      headers: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        url: string().url('Please enter a valid webhook URL'),
        secret: string().optional(),
        headers: string().optional(),
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
            label="Webhook URL"
            {...form.register('url')}
            placeholder="https://your-webhook-url.com/endpoint"
          />

          <Input
            label="Secret Key (Optional)"
            type="password"
            {...form.register('secret')}
            placeholder="Your webhook secret"
          />

          <Textarea
            label="Custom Headers (Optional, JSON format)"
            {...form.register('headers')}
            placeholder='{"Authorization": "Bearer token"}'
          />

          <Button type="submit">Connect Webhook</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('webhooks', WebhooksProviderComponent);
