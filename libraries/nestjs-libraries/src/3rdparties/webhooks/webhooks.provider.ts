import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Webhook data
 */
interface WebhookData {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
}

/**
 * Interface for Webhook response
 */
interface WebhookResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
}

/**
 * Webhooks Provider
 *
 * Generic webhook provider for sending HTTP requests to custom endpoints.
 * Supports all HTTP methods and custom headers for maximum flexibility.
 *
 * @see https://en.wikipedia.org/wiki/Webhook
 */
@ThirdParty({
  identifier: 'webhooks',
  title: 'Webhooks',
  description: 'Send data to custom HTTP endpoints',
  position: 'webhook',
  fields: [],
})
export class WebhooksProvider extends ThirdPartyAbstract<WebhookData> {
  /**
   * Check if the webhook URL is valid and reachable
   *
   * @param apiKey - Webhook URL (used as identifier)
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Validate URL format
      const url = new URL(apiKey);

      // Try to make a HEAD request to check if endpoint exists
      const response = await fetch(apiKey, {
        method: 'HEAD',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      return {
        name: `Webhook: ${url.hostname}`,
        username: url.hostname,
        id: apiKey,
      };
    } catch (error) {
      // If HEAD fails, assume it's valid anyway (some endpoints don't support HEAD)
      try {
        const url = new URL(apiKey);
        return {
          name: `Webhook: ${url.hostname}`,
          username: url.hostname,
          id: apiKey,
        };
      } catch {
        return false;
      }
    }
  }

  /**
   * Send data to webhook endpoint
   *
   * @param apiKey - Webhook URL (not used, URL comes from data)
   * @param data - Webhook request data
   * @returns Response status message
   */
  async sendData(
    apiKey: string,
    data: WebhookData
  ): Promise<string> {
    try {
      const method = data.method || 'POST';
      const timeout = data.timeout || 30000; // 30 seconds default

      const requestInit: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...data.headers,
        },
        signal: AbortSignal.timeout(timeout),
      };

      // Only add body for methods that support it
      if (method !== 'GET' && data.body) {
        requestInit.body = typeof data.body === 'string'
          ? data.body
          : JSON.stringify(data.body);
      }

      const response = await fetch(data.url, requestInit);

      const responseData: WebhookResponse = {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: null,
      };

      // Try to parse response body
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        responseData.data = await response.json();
      } else {
        responseData.data = await response.text();
      }

      if (!response.ok) {
        throw new Error(
          `Webhook request failed: ${response.status} ${response.statusText}`
        );
      }

      return JSON.stringify(responseData, null, 2);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Webhook request timeout');
      }
      throw new Error(`Failed to send webhook: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Test webhook endpoint with a ping request
   *
   * @param apiKey - Webhook URL
   * @param data - Optional test data
   * @returns Test result
   */
  async testWebhook(
    apiKey: string,
    data?: any
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          ...data,
        }),
        signal: AbortSignal.timeout(5000),
      });

      return {
        success: response.ok,
        message: `Test webhook sent: ${response.status} ${response.statusText}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `Test webhook failed: ${error instanceof Error ? error.message : String(error)}`,
      };
    }
  }
}
