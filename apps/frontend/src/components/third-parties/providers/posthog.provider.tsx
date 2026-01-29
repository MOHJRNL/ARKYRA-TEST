import { thirdPartyWrapper } from '@gitroom/frontend/components/third-parties/third-party.wrapper';
import { useThirdPartySubmit } from '@gitroom/frontend/components/third-parties/third-party.function';
import { useThirdParty } from '@gitroom/frontend/components/third-parties/third-party.media';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { Button } from '@gitroom/react/form/button';
import { useCallback } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { object, string } from 'zod';
import { Input } from '@gitroom/react/form/input';

const PosthogProviderComponent = () => {
  const thirdParty = useThirdParty();
  const send = useThirdPartySubmit();

  const form = useForm({
    values: {
      api_key: '',
      project_id: '',
    },
    mode: 'all',
    resolver: zodResolver(
      object({
        api_key: string().min(1, 'API key is required'),
        project_id: string().min(1, 'Project ID is required'),
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
            label="PostHog API Key"
            type="password"
            {...form.register('api_key')}
            placeholder="Enter your PostHog API key"
          />

          <Input
            label="Project ID"
            {...form.register('project_id')}
            placeholder="Enter your PostHog project ID"
          />

          <div className="text-sm text-gray-400 mb-4">
            Find your API key and project ID in{' '}
            <a
              href="https://posthog.com/settings/project"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forth underline"
            >
              PostHog Settings
            </a>
          </div>

          <Button type="submit">Connect PostHog</Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default thirdPartyWrapper('posthog', PosthogProviderComponent);
