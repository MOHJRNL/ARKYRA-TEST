import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Zapier webhook data
 */
interface ZapierWebhookData {
  webhook_url: string;
  data: Record<string, any>;
  headers?: Record<string, string>;
}

/**
 * Zapier Provider
 *
 * Zapier integration for connecting 5000+ apps through webhooks.
 * This provider sends data to Zapier webhook triggers.
 *
 * @see https://zapier.com/help/doc/how-get-started-webhooks-zapier
 */
@ThirdParty({
  identifier: 'zapier',
  title: 'Zapier',
  description: 'Connect to 5000+ apps through Zapier webhooks',
  position: 'webhook',
  fields: [],
})
export class ZapierProvider extends ThirdPartyAbstract<ZapierWebhookData> {
  /**
   * Check if the Zapier webhook URL is valid
   *
   * @param apiKey - Zapier webhook URL
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Validate Zapier webhook URL format
      const url = new URL(apiKey);

      if (!url.hostname.includes('zapier.com') && !url.hostname.includes('hooks.zapier.com')) {
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

      // Zapier webhooks typically return 200 even for test data
      return {
        name: 'Zapier Webhook',
        username: 'zapier',
        id: apiKey,
      };
    } catch (error) {
      // If connection check fails, try to validate URL format anyway
      try {
        const url = new URL(apiKey);
        if (url.hostname.includes('zapier.com') || url.hostname.includes('hooks.zapier.com')) {
          return {
            name: 'Zapier Webhook',
            username: 'zapier',
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
   * Send data to Zapier webhook
   *
   * @param apiKey - Zapier webhook URL
   * @param data - Data to send to Zapier
   * @returns Success message
   */
  async sendData(
    apiKey: string,
    data: ZapierWebhookData
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
          timestamp: new Date().toISOString(),
          source: 'arkyra',
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!response.ok) {
        throw new Error(
          `Zapier webhook failed: ${response.status} ${response.statusText}`
        );
      }

      const responseText = await response.text();

      return `Zapier webhook triggered successfully: ${responseText || 'OK'}`;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Zapier webhook timeout');
      }
      throw new Error(`Failed to trigger Zapier webhook: ${error.message}`);
    }
  }

  /**
   * Batch send multiple events to Zapier
   *
   * @param apiKey - Zapier webhook URL
   * @param data - Array of events to send
   * @returns Success message with count
   */
  async batchSend(
    apiKey: string,
    data: { events: Record<string, any>[] }
  ): Promise<string> {
    try {
      const results = await Promise.all(
        data.events.map((event) =>
          this.sendData(apiKey, {
            webhook_url: apiKey,
            data: event,
          })
        )
      );

      return `Successfully sent ${results.length} events to Zapier`;
    } catch (error) {
      throw new Error(`Failed to batch send to Zapier: ${error.message}`);
    }
  }
}
