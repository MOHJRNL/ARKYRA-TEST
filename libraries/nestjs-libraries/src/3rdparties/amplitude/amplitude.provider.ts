import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Amplitude data
 */
interface AmplitudeData {
  action: 'track_event' | 'identify' | 'get_events' | 'get_user' | 'get_cohorts';
  user_id?: string;
  device_id?: string;
  event_type?: string;
  event_properties?: Record<string, any>;
  user_properties?: Record<string, any>;
  start_date?: string;
  end_date?: string;
}

/**
 * Interface for Amplitude event
 */
interface AmplitudeEvent {
  user_id?: string;
  device_id?: string;
  event_type: string;
  time?: number;
  event_properties?: Record<string, any>;
  user_properties?: Record<string, any>;
}

/**
 * Amplitude Provider
 *
 * Amplitude is a digital analytics platform for tracking user behavior.
 * This provider handles event tracking, user identification, and analytics queries.
 *
 * @see https://www.docs.developers.amplitude.com/analytics/apis/http-v2-api/
 */
@ThirdParty({
  identifier: 'amplitude',
  title: 'Amplitude',
  description: 'Digital analytics and user behavior tracking',
  position: 'webhook',
  fields: [],
})
export class AmplitudeProvider extends ThirdPartyAbstract<AmplitudeData> {
  private readonly httpApiUrl = 'https://api2.amplitude.com/2/httpapi';
  private readonly apiUrl = 'https://amplitude.com/api/2';

  /**
   * Check if the API key is valid by testing API access
   *
   * @param apiKey - Amplitude API key (format: "api_key" or "api_key:secret_key")
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // Amplitude uses API key authentication
      const [key, secretKey] = apiKey.includes(':') ? apiKey.split(':') : [apiKey, null];

      // If we have a secret key, test with it
      if (secretKey) {
        const response = await fetch(`${this.apiUrl}/projects`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${Buffer.from(`${key}:${secretKey}`).toString('base64')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          return {
            name: 'Amplitude',
            username: key,
            id: key,
          };
        }
      }

      // Otherwise just validate format
      return {
        name: 'Amplitude',
        username: key,
        id: key,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Perform action on Amplitude
   *
   * @param apiKey - Amplitude API key
   * @param data - Action data
   * @returns Result message
   */
  async sendData(
    apiKey: string,
    data: AmplitudeData
  ): Promise<string> {
    try {
      switch (data.action) {
        case 'track_event':
          return await this.trackEvent(apiKey, data);
        case 'identify':
          return await this.identify(apiKey, data);
        case 'get_events':
          return await this.getEvents(apiKey, data);
        case 'get_user':
          return await this.getUser(apiKey, data);
        case 'get_cohorts':
          return await this.getCohorts(apiKey);
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      throw new Error(`Failed to perform Amplitude action: ${error.message}`);
    }
  }

  /**
   * Track an event in Amplitude
   */
  private async trackEvent(apiKey: string, data: AmplitudeData): Promise<string> {
    if (!data.event_type) {
      throw new Error('event_type is required for track_event action');
    }
    if (!data.user_id && !data.device_id) {
      throw new Error('Either user_id or device_id is required for track_event action');
    }

    const [key] = apiKey.split(':');

    const response = await fetch(this.httpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: key,
        events: [
          {
            user_id: data.user_id,
            device_id: data.device_id,
            event_type: data.event_type,
            time: Date.now(),
            event_properties: data.event_properties || {},
            user_properties: data.user_properties,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to track event');
    }

    const result = await response.json();
    return `Event tracked successfully: ${data.event_type}`;
  }

  /**
   * Identify a user in Amplitude
   */
  private async identify(apiKey: string, data: AmplitudeData): Promise<string> {
    if (!data.user_id && !data.device_id) {
      throw new Error('Either user_id or device_id is required for identify action');
    }
    if (!data.user_properties) {
      throw new Error('user_properties is required for identify action');
    }

    const [key] = apiKey.split(':');

    const response = await fetch('https://api2.amplitude.com/identify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: key,
        identification: [
          {
            user_id: data.user_id,
            device_id: data.device_id,
            user_properties: data.user_properties,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to identify user');
    }

    return `User identified successfully: ${data.user_id || data.device_id}`;
  }

  /**
   * Get events from Amplitude
   */
  private async getEvents(apiKey: string, data: AmplitudeData): Promise<string> {
    const [key, secretKey] = apiKey.split(':');

    if (!secretKey) {
      throw new Error('Secret key required for get_events action');
    }

    const params = new URLSearchParams();
    if (data.start_date) params.append('start', data.start_date);
    if (data.end_date) params.append('end', data.end_date);

    const response = await fetch(`${this.apiUrl}/events/list?${params}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${key}:${secretKey}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get events');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Get user information from Amplitude
   */
  private async getUser(apiKey: string, data: AmplitudeData): Promise<string> {
    const [key, secretKey] = apiKey.split(':');

    if (!secretKey) {
      throw new Error('Secret key required for get_user action');
    }
    if (!data.user_id) {
      throw new Error('user_id is required for get_user action');
    }

    const response = await fetch(
      `${this.apiUrl}/useractivity?user=${encodeURIComponent(data.user_id)}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${key}:${secretKey}`).toString('base64')}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get user');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Get cohorts from Amplitude
   */
  private async getCohorts(apiKey: string): Promise<string> {
    const [key, secretKey] = apiKey.split(':');

    if (!secretKey) {
      throw new Error('Secret key required for get_cohorts action');
    }

    const response = await fetch(`${this.apiUrl}/cohorts`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${key}:${secretKey}`).toString('base64')}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to get cohorts');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Batch track multiple events
   *
   * @param apiKey - Amplitude API key
   * @param events - Array of events to track
   * @returns Success message
   */
  async batchTrack(apiKey: string, events: AmplitudeEvent[]): Promise<string> {
    const [key] = apiKey.split(':');

    const response = await fetch(this.httpApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: key,
        events: events.map((e) => ({
          ...e,
          time: e.time || Date.now(),
        })),
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to batch track events');
    }

    const result = await response.json();
    return `Batch tracked ${events.length} events successfully`;
  }
}
