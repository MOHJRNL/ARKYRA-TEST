'use client';

import { FC, useState, useCallback } from 'react';
import { useFetch } from '@gitroom/helpers/utils/custom.fetch';
import useSWR from 'swr';
import { Button } from '@gitroom/react/form/button';
import { useRouter } from 'next/navigation';
import { useModals } from '@gitroom/frontend/components/layout/new-modal';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@gitroom/react/form/input';
import { useToaster } from '@gitroom/react/toaster/toaster';

interface Integration {
  identifier: string;
  title: string;
  description: string;
  category: 'video' | 'audio' | 'ai' | 'automation' | 'content';
  connected: boolean;
  logo: string;
}

const INTEGRATION_CATEGORIES = {
  video: { label: 'Video & Media', icon: '🎥' },
  audio: { label: 'Audio', icon: '🔊' },
  ai: { label: 'AI Models', icon: '🤖' },
  automation: { label: 'Automation', icon: '🔁' },
  content: { label: 'Content Sources', icon: '📄' },
};

const INTEGRATIONS_MAP: Record<string, Integration> = {
  heygen: {
    identifier: 'heygen',
    title: 'HeyGen',
    description: 'AI-generated avatar videos',
    category: 'video',
    connected: false,
    logo: '/icons/third-party/heygen.png',
  },
  synthesia: {
    identifier: 'synthesia',
    title: 'Synthesia',
    description: 'Create AI videos with avatars',
    category: 'video',
    connected: false,
    logo: '/icons/third-party/synthesia.png',
  },
  'd-id': {
    identifier: 'd-id',
    title: 'D-ID',
    description: 'Talking avatars from photos',
    category: 'video',
    connected: false,
    logo: '/icons/third-party/d-id.png',
  },
  runway: {
    identifier: 'runway',
    title: 'Runway',
    description: 'AI video generation',
    category: 'video',
    connected: false,
    logo: '/icons/third-party/runway.png',
  },
  elevenlabs: {
    identifier: 'elevenlabs',
    title: 'ElevenLabs',
    description: 'Realistic AI voices',
    category: 'audio',
    connected: false,
    logo: '/icons/third-party/elevenlabs.png',
  },
  murf: {
    identifier: 'murf',
    title: 'Murf AI',
    description: 'Studio-quality voiceovers',
    category: 'audio',
    connected: false,
    logo: '/icons/third-party/murf.png',
  },
  playht: {
    identifier: 'playht',
    title: 'PlayHT',
    description: 'Ultra-realistic AI voices',
    category: 'audio',
    connected: false,
    logo: '/icons/third-party/playht.png',
  },
  openai: {
    identifier: 'openai',
    title: 'OpenAI',
    description: 'GPT-4 & DALL-E',
    category: 'ai',
    connected: false,
    logo: '/icons/third-party/openai.png',
  },
  claude: {
    identifier: 'claude',
    title: 'Claude',
    description: 'Anthropic AI assistant',
    category: 'ai',
    connected: false,
    logo: '/icons/third-party/claude.png',
  },
  mistral: {
    identifier: 'mistral',
    title: 'Mistral',
    description: 'Open-weight AI models',
    category: 'ai',
    connected: false,
    logo: '/icons/third-party/mistral.png',
  },
  webhooks: {
    identifier: 'webhooks',
    title: 'Webhooks',
    description: 'Custom HTTP endpoints',
    category: 'automation',
    connected: false,
    logo: '/icons/third-party/webhooks.png',
  },
  zapier: {
    identifier: 'zapier',
    title: 'Zapier',
    description: 'Connect 5000+ apps',
    category: 'automation',
    connected: false,
    logo: '/icons/third-party/zapier.png',
  },
  make: {
    identifier: 'make',
    title: 'Make',
    description: 'Advanced automation',
    category: 'automation',
    connected: false,
    logo: '/icons/third-party/make.png',
  },
  n8n: {
    identifier: 'n8n',
    title: 'n8n',
    description: 'Open-source workflows',
    category: 'automation',
    connected: false,
    logo: '/icons/third-party/n8n.png',
  },
  notion: {
    identifier: 'notion',
    title: 'Notion',
    description: 'Workspace & notes',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/notion.png',
  },
  'google-sheets': {
    identifier: 'google-sheets',
    title: 'Google Sheets',
    description: 'Spreadsheet data',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/google-sheets.png',
  },
  airtable: {
    identifier: 'airtable',
    title: 'Airtable',
    description: 'Database & spreadsheets',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/airtable.png',
  },
  ga4: {
    identifier: 'ga4',
    title: 'Google Analytics 4',
    description: 'Analytics data',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/ga4.png',
  },
  'looker-studio': {
    identifier: 'looker-studio',
    title: 'Looker Studio',
    description: 'Data visualization',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/looker-studio.png',
  },
  posthog: {
    identifier: 'posthog',
    title: 'PostHog',
    description: 'Product analytics',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/posthog.png',
  },
  amplitude: {
    identifier: 'amplitude',
    title: 'Amplitude',
    description: 'Digital analytics',
    category: 'content',
    connected: false,
    logo: '/icons/third-party/amplitude.png',
  },
};

const ApiModal: FC<{
  identifier: string;
  title: string;
  update: () => void;
}> = (props) => {
  const { title, identifier, update } = props;
  const fetch = useFetch();
  const router = useRouter();
  const modal = useModals();
  const toaster = useToaster();
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: 'onChange',
  });

  const closePopup = useCallback(() => {
    modal.closeAll();
  }, [modal]);

  const submit = useCallback(
    async (data: any) => {
      setLoading(true);
      const add = await fetch(`/third-party/${identifier}`, {
        method: 'POST',
        body: JSON.stringify({
          api: data.api,
        }),
      });

      if (add.ok) {
        toaster.show('Integration added successfully', 'success');
        closePopup();
        router.refresh();
        if (update) update();
        return;
      }

      const { message } = await add.json();

      methods.setError('api', {
        message,
      });

      setLoading(false);
    },
    [identifier, fetch, toaster, closePopup, router, update, methods]
  );

  return (
    <div className="relative">
      <FormProvider {...methods}>
        <form
          className="gap-[8px] flex flex-col"
          onSubmit={methods.handleSubmit(submit)}
        >
          <div className="pt-[10px]">
            <Input label="API Key" name="api" />
          </div>
          <div>
            <Button loading={loading} type="submit">
              Add Integration
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

const IntegrationCard: FC<{
  integration: Integration;
  onConnect: () => void;
}> = ({ integration, onConnect }) => {
  return (
    <div className="w-full h-full p-[20px] min-h-[140px] text-[14px] bg-newTableHeader hover:bg-newTableBorder rounded-[8px] transition-all text-textColor relative flex flex-col gap-[15px]">
      <div className="flex items-center gap-[10px]">
        <img
          className="w-[40px] h-[40px] object-contain"
          src={integration.logo}
          alt={integration.title}
          onError={(e) => {
            e.currentTarget.src = '/icons/third-party/default.png';
          }}
        />
        <div>
          <div className="font-semibold text-[16px]">{integration.title}</div>
          {integration.connected && (
            <span className="text-[12px] text-green-500">Connected</span>
          )}
        </div>
      </div>
      <div className="flex-1 text-[13px] opacity-80">
        {integration.description}
      </div>
      <div className="w-full flex">
        <Button className="w-full" onClick={onConnect}>
          {integration.connected ? 'Manage' : 'Connect'}
        </Button>
      </div>
    </div>
  );
};

export const IntegrationsDashboard: FC<{ reload: () => void }> = (props) => {
  const fetch = useFetch();
  const modals = useModals();
  const { reload } = props;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const integrationsList = useCallback(async () => {
    return (await fetch('/third-party/list')).json();
  }, [fetch]);

  const { data, mutate } = useSWR('third-party-list', integrationsList, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    revalidateOnMount: true,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
  });

  const addApiKey = useCallback(
    (title: string, identifier: string) => () => {
      modals.openModal({
        title: `Add API key for ${title}`,
        withCloseButton: false,
        children: (
          <ApiModal
            identifier={identifier}
            title={title}
            update={() => {
              reload();
              mutate();
            }}
          />
        ),
      });
    },
    [modals, reload, mutate]
  );

  const getIntegrationsByCategory = useCallback(
    (category: string) => {
      return Object.values(INTEGRATIONS_MAP).filter(
        (integration) => integration.category === category
      );
    },
    []
  );

  const filteredIntegrations = selectedCategory
    ? getIntegrationsByCategory(selectedCategory)
    : Object.values(INTEGRATIONS_MAP);

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex flex-wrap gap-[10px]">
        <Button
          onClick={() => setSelectedCategory(null)}
          className={
            selectedCategory === null ? 'bg-primary' : 'bg-newTableHeader'
          }
        >
          All Integrations
        </Button>
        {Object.entries(INTEGRATION_CATEGORIES).map(([key, category]) => (
          <Button
            key={key}
            onClick={() => setSelectedCategory(key)}
            className={
              selectedCategory === key ? 'bg-primary' : 'bg-newTableHeader'
            }
          >
            {category.icon} {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[15px]">
        {filteredIntegrations.map((integration) => (
          <IntegrationCard
            key={integration.identifier}
            integration={integration}
            onConnect={addApiKey(integration.title, integration.identifier)}
          />
        ))}
      </div>
    </div>
  );
};
