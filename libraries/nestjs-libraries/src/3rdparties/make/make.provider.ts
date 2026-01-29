import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Make webhook data
 */
interface MakeWebhookData {
  webhook_url: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
  scenario_id?: string;
}

/**
 * Make (formerly Integromat) Provider
 *
 * Make is an advanced automation platform for connecting apps and services.
 * This provider sends data to Make webhook triggers.
 *
 * @see https://www.make.com/en/help/webhooks
 */
@ThirdParty({
  identifier: 'make',
  title: 'Make',
  description: 'Advanced automation with Make (formerly Integromat)',
  position: 'webhook',
  fields: [],
})
export class MakeProvider extends ThirdPartyAbstract<MakeWebhookData> {
  /**
   * Check if the Make webhook URL is valid
   *
   * @param apiKey - Make webhook URL
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Validate Make webhook URL format
      const url = new URL(apiKey);

      if (
        !url.hostname.includes('make.com') &&
        !url.hostname.includes('integromat.com') &&
        !url.hostname.includes('hook.eu1.make.com') &&
        !url.hostname.includes('hook.us1.make.com')
      ) {
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

      // Make webhooks typically return 200-202 for valid requests
      if (response.status >= 200 && response.status < 300) {
        return {
          name: 'Make Webhook',
          username: 'make',
          id: apiKey,
        };
      }

      return false;
    } catch (error) {
      // If connection check fails, try to validate URL format anyway
      try {
        const url = new URL(apiKey);
        if (
          url.hostname.includes('make.com') ||
          url.hostname.includes('integromat.com')
        ) {
          return {
            name: 'Make Webhook',
            username: 'make',
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
   * Send data to Make webhook
   *
   * @param apiKey - Make webhook URL
   * @param data - Data to send to Make
   * @returns Success message
   */
  async sendData(
    apiKey: string,
    data: MakeWebhookData
  ): Promise<string> {
    try {
      const webhookUrl = data.webhook_url || apiKey;

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...data.headers,
        },
        body: JSON.stringify({
          ...data.data,
          ...(data.scenario_id && { scenario_id: data.scenario_id }),
          timestamp: new Date().toISOString(),
          source: 'arkyra',
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(
          `Make webhook failed: ${response.status} ${response.statusText}`
        );
      }

      let responseData: any;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }

      return `Make webhook triggered successfully: ${
        typeof responseData === 'string'
          ? responseData
          : JSON.stringify(responseData)
      }`;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Make webhook timeout');
      }
      throw new Error(`Failed to trigger Make webhook: ${error.message}`);
    }
  }

  /**
   * Send data with custom scenario routing
   *
   * @param apiKey - Make webhook URL
   * @param data - Data with scenario configuration
   * @returns Success message
   */
  async sendToScenario(
    apiKey: string,
    data: { scenario_id: string; data: Record<string, any> }
  ): Promise<string> {
    return this.sendData(apiKey, {
      webhook_url: apiKey,
      data: data.data,
      scenario_id: data.scenario_id,
    });
  }
}
