import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Textarea } from '@gitroom/react/form/textarea';
import { Input } from '@gitroom/react/form/input';

const Ga4ProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      property_id: '',
      credentials: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        property_id: string().min(1, 'Property ID is required'),
        credentials: string().min(1, 'Service account credentials are required'),
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
            label="GA4 Property ID"
            {...form.register('property_id')}
            placeholder="123456789"
          />

          <Textarea
            label="Service Account JSON Credentials"
            {...form.register('credentials')}
            placeholder='{"type": "service_account", "project_id": "...", ...}'
          />

          <div className="text-sm text-gray-400 mb-4">
            Create a service account in{' '}
            <a
              href="https://console.cloud.google.com/iam-admin/serviceaccounts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forth underline"
            >
              Google Cloud Console
            </a>{' '}
            and enable the Google Analytics Data API
          </div>

          <Button type="submit">Connect GA4</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('ga4', Ga4ProviderComponent);
