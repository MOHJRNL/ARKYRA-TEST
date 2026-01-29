import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for GA4 data
 */
interface GA4Data {
  property_id: string;
  date_ranges: Array<{ start_date: string; end_date: string }>;
  metrics: Array<{ name: string }>;
  dimensions?: Array<{ name: string }>;
  dimension_filter?: any;
  metric_filter?: any;
  order_bys?: Array<{ metric?: { metric_name: string }; desc?: boolean }>;
  limit?: number;
}

/**
 * Google Analytics 4 Provider
 *
 * Google Analytics 4 (GA4) is the latest version of Google's analytics platform.
 * This provider handles data queries from GA4 properties.
 *
 * @see https://developers.google.com/analytics/devguides/reporting/data/v1
 */
@ThirdParty({
  identifier: 'ga4',
  title: 'Google Analytics 4',
  description: 'Fetch analytics data from Google Analytics 4',
  position: 'webhook',
  fields: [],
})
export class GA4Provider extends ThirdPartyAbstract<GA4Data> {
  private readonly baseUrl = 'https://analyticsdata.googleapis.com/v1beta';

  /**
   * Check if the API key is valid by testing API access
   *
   * @param apiKey - Google API key or OAuth token
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      // For OAuth tokens
      if (apiKey.startsWith('ya29.') || apiKey.length > 100) {
        return {
          name: 'Google Analytics 4',
          username: 'ga4',
          id: 'ga4',
        };
      }

      // For API keys
      return {
        name: 'Google Analytics 4',
        username: 'ga4',
        id: 'ga4',
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Run a report on GA4 property
   *
   * @param apiKey - Google API key or OAuth token
   * @param data - Report data
   * @returns Report results
   */
  async sendData(
    apiKey: string,
    data: GA4Data
  ): Promise<string> {
    try {
      const authHeader = apiKey.startsWith('ya29.')
        ? { 'Authorization': `Bearer ${apiKey}` }
        : {};
      const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

      const response = await fetch(
        `${this.baseUrl}/properties/${data.property_id}:runReport${keyParam}`,
        {
          method: 'POST',
          headers: {
            ...authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dateRanges: data.date_ranges,
            metrics: data.metrics,
            dimensions: data.dimensions,
            dimensionFilter: data.dimension_filter,
            metricFilter: data.metric_filter,
            orderBys: data.order_bys,
            limit: data.limit || 10000,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to run report');
      }

      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(`Failed to run GA4 report: ${error.message}`);
    }
  }

  /**
   * Get real-time report from GA4
   *
   * @param apiKey - Google API key or OAuth token
   * @param data - Real-time report data
   * @returns Real-time report results
   */
  async realtimeReport(
    apiKey: string,
    data: {
      property_id: string;
      metrics: Array<{ name: string }>;
      dimensions?: Array<{ name: string }>;
      limit?: number;
    }
  ): Promise<string> {
    try {
      const authHeader = apiKey.startsWith('ya29.')
        ? { 'Authorization': `Bearer ${apiKey}` }
        : {};
      const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

      const response = await fetch(
        `${this.baseUrl}/properties/${data.property_id}:runRealtimeReport${keyParam}`,
        {
          method: 'POST',
          headers: {
            ...authHeader,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            metrics: data.metrics,
            dimensions: data.dimensions,
            limit: data.limit || 10000,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to run realtime report');
      }

      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(`Failed to run GA4 realtime report: ${error.message}`);
    }
  }

  /**
   * Get metadata for GA4 property
   *
   * @param apiKey - Google API key or OAuth token
   * @param propertyId - GA4 property ID
   * @returns Property metadata
   */
  async getMetadata(apiKey: string, propertyId: string): Promise<string> {
    try {
      const authHeader = apiKey.startsWith('ya29.')
        ? { 'Authorization': `Bearer ${apiKey}` }
        : {};
      const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

      const response = await fetch(
        `${this.baseUrl}/properties/${propertyId}/metadata${keyParam}`,
        {
          method: 'GET',
          headers: authHeader,
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to get metadata');
      }

      const result = await response.json();
      return JSON.stringify(result, null, 2);
    } catch (error) {
      throw new Error(`Failed to get GA4 metadata: ${error.message}`);
    }
  }
}
