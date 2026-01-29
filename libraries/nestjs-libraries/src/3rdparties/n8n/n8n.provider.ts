import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for n8n webhook data
 */
interface N8nWebhookData {
  webhook_url: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
  workflow_id?: string;
  execution_mode?: 'synchronous' | 'asynchronous';
}

/**
 * n8n Provider
 *
 * n8n is an open-source workflow automation platform.
 * This provider sends data to n8n webhook triggers.
 *
 * @see https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/
 */
@ThirdParty({
  identifier: 'n8n',
  title: 'n8n',
  description: 'Open-source workflow automation platform',
  position: 'webhook',
  fields: [],
})
export class N8nProvider extends ThirdPartyAbstract<N8nWebhookData> {
  /**
   * Check if the n8n webhook URL is valid
   *
   * @param apiKey - n8n webhook URL
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Validate n8n webhook URL format
      const url = new URL(apiKey);

      // n8n webhooks typically have /webhook/ in the path
      if (!url.pathname.includes('/webhook')) {
        return false;
      }

      // Send a test ping to validate webhook
      const response = await fetch(apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          type: 'connection_check',
          timestamp: new Date().toISOString(),
        }),
        signal: AbortSignal.timeout(5000),
      });

      // n8n webhooks return various status codes depending on configuration
      if (response.status >= 200 && response.status < 500) {
        return {
          name: `n8n Webhook: ${url.hostname}`,
          username: 'n8n',
          id: apiKey,
        };
      }

      return false;
    } catch (error) {
      // If connection check fails, try to validate URL format anyway
      try {
        const url = new URL(apiKey);
        if (url.pathname.includes('/webhook')) {
          return {
            name: `n8n Webhook: ${url.hostname}`,
            username: 'n8n',
            id: apiKey,
          };
        }
      } catch {
        return false;
      }
      return false;
    }
  }

  /**
   * Send data to n8n webhook
   *
   * @param apiKey - n8n webhook URL
   * @param data - Data to send to n8n
   * @returns Success message
   */
  async sendData(
    apiKey: string,
    data: N8nWebhookData
  ): Promise<string> {
    try {
      const webhookUrl = data.webhook_url || apiKey;

      // Determine if we should wait for response (synchronous)
      const isSync = data.execution_mode === 'synchronous';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...data.headers,
          ...(isSync && { 'X-N8n-Execution-Mode': 'wait' }),
        },
        body: JSON.stringify({
          ...data.data,
          ...(data.workflow_id && { workflow_id: data.workflow_id }),
          timestamp: new Date().toISOString(),
          source: 'arkyra',
        }),
        signal: AbortSignal.timeout(isSync ? 60000 : 30000), // Longer timeout for sync
      });

      if (!response.ok) {
        throw new Error(
          `n8n webhook failed: ${response.status} ${response.statusText}`
        );
      }

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return `n8n webhook triggered successfully: ${
        typeof responseData === 'string'
          ? responseData
          : JSON.stringify(responseData)
      }`;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('n8n webhook timeout');
      }
      throw new Error(`Failed to trigger n8n webhook: ${error.message}`);
    }
  }

  /**
   * Send data with synchronous execution (wait for workflow to complete)
   *
   * @param apiKey - n8n webhook URL
   * @param data - Data to send
   * @returns Workflow execution result
   */
  async sendSync(
    apiKey: string,
    data: Record<string, any>
  ): Promise<string> {
    return this.sendData(apiKey, {
      webhook_url: apiKey,
      data,
      execution_mode: 'synchronous',
    });
  }

  /**
   * Send data with asynchronous execution (fire and forget)
   *
   * @param apiKey - n8n webhook URL
   * @param data - Data to send
   * @returns Confirmation message
   */
  async sendAsync(
    apiKey: string,
    data: Record<string, any>
  ): Promise<string> {
    return this.sendData(apiKey, {
      webhook_url: apiKey,
      data,
      execution_mode: 'asynchronous',
    });
  }
}
