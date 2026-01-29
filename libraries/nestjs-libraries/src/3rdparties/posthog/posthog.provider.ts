import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for PostHog data
 */
interface PostHogData {
  action: 'capture_event' | 'get_events' | 'get_insights' | 'create_insight' | 'get_persons';
  event?: string;
  distinct_id?: string;
  properties?: Record<string, any>;
  insight_type?: 'trends' | 'funnels' | 'retention' | 'paths';
  filters?: any;
  date_from?: string;
  date_to?: string;
}

/**
 * Interface for PostHog event
 */
interface PostHogEvent {
  event: string;
  properties: Record<string, any>;
  timestamp?: string;
}

/**
 * PostHog Provider
 *
 * PostHog is an open-source product analytics platform.
 * This provider handles event capture, insights, and analytics queries.
 *
 * @see https://posthog.com/docs/api
 */
@ThirdParty({
  identifier: 'posthog',
  title: 'PostHog',
  description: 'Product analytics and event tracking with PostHog',
  position: 'webhook',
  fields: [],
})
export class PostHogProvider extends ThirdPartyAbstract<PostHogData> {
  private readonly baseUrl = 'https://app.posthog.com';

  /**
   * Check if the API key is valid by testing API access
   *
   * @param apiKey - PostHog API key (format: "project_key" or "project_id:personal_api_key")
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Parse API key format
      const [projectKey, personalKey] = apiKey.includes(':')
        ? apiKey.split(':')
        : [apiKey, null];

      // Test with project info endpoint if personal key provided
      if (personalKey) {
        const response = await fetch(`${this.baseUrl}/api/projects/@current/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${personalKey}`,
          },
        });

        if (!response.ok) {
          return false;
        }

        const data = await response.json();

        return {
          name: data.name || 'PostHog Project',
          username: projectKey,
          id: data.id?.toString() || projectKey,
        };
      }

      // Otherwise just validate format
      return {
        name: 'PostHog',
        username: projectKey,
        id: projectKey,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Perform action on PostHog
   *
   * @param apiKey - PostHog API key
   * @param data - Action data
   * @returns Result message
   */
  async sendData(
    apiKey: string,
    data: PostHogData
  ): Promise<string> {
    try {
      switch (data.action) {
        case 'capture_event':
          return await this.captureEvent(apiKey, data);
        case 'get_events':
          return await this.getEvents(apiKey, data);
        case 'get_insights':
          return await this.getInsights(apiKey, data);
        case 'create_insight':
          return await this.createInsight(apiKey, data);
        case 'get_persons':
          return await this.getPersons(apiKey, data);
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      throw new Error(`Failed to perform PostHog action: ${error.message}`);
    }
  }

  /**
   * Capture an event in PostHog
   */
  private async captureEvent(apiKey: string, data: PostHogData): Promise<string> {
    if (!data.event || !data.distinct_id) {
      throw new Error('event and distinct_id are required for capture_event action');
    }

    const [projectKey] = apiKey.split(':');

    const response = await fetch(`${this.baseUrl}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: projectKey,
        event: data.event,
        properties: {
          distinct_id: data.distinct_id,
          ...data.properties,
        },
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to capture event');
    }

    return `Event captured successfully: ${data.event}`;
  }

  /**
   * Get events from PostHog
   */
  private async getEvents(apiKey: string, data: PostHogData): Promise<string> {
    const [, personalKey] = apiKey.split(':');

    if (!personalKey) {
      throw new Error('Personal API key required for get_events action');
    }

    const params = new URLSearchParams();
    if (data.event) params.append('event', data.event);
    if (data.distinct_id) params.append('distinct_id', data.distinct_id);

    const response = await fetch(
      `${this.baseUrl}/api/projects/@current/events/?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${personalKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get events');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Get insights from PostHog
   */
  private async getInsights(apiKey: string, data: PostHogData): Promise<string> {
    const [, personalKey] = apiKey.split(':');

    if (!personalKey) {
      throw new Error('Personal API key required for get_insights action');
    }

    const response = await fetch(
      `${this.baseUrl}/api/projects/@current/insights/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${personalKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get insights');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Create a new insight in PostHog
   */
  private async createInsight(apiKey: string, data: PostHogData): Promise<string> {
    const [, personalKey] = apiKey.split(':');

    if (!personalKey) {
      throw new Error('Personal API key required for create_insight action');
    }

    const response = await fetch(
      `${this.baseUrl}/api/projects/@current/insights/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${personalKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.event || 'Custom Insight',
          filters: data.filters || {},
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create insight');
    }

    const result = await response.json();
    return `Insight created successfully: ${result.id}`;
  }

  /**
   * Get persons (users) from PostHog
   */
  private async getPersons(apiKey: string, data: PostHogData): Promise<string> {
    const [, personalKey] = apiKey.split(':');

    if (!personalKey) {
      throw new Error('Personal API key required for get_persons action');
    }

    const response = await fetch(
      `${this.baseUrl}/api/projects/@current/persons/`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${personalKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to get persons');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Batch capture multiple events
   *
   * @param apiKey - PostHog API key
   * @param events - Array of events to capture
   * @returns Success message
   */
  async batchCapture(
    apiKey: string,
    events: Array<{ event: string; distinct_id: string; properties?: Record<string, any> }>
  ): Promise<string> {
    const [projectKey] = apiKey.split(':');

    const response = await fetch(`${this.baseUrl}/batch/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: projectKey,
        batch: events.map((e) => ({
          event: e.event,
          properties: {
            distinct_id: e.distinct_id,
            ...e.properties,
          },
          timestamp: new Date().toISOString(),
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to batch capture events');
    }

    return `Batch captured ${events.length} events successfully`;
  }
}
