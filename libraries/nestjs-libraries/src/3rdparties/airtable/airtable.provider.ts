import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Airtable data
 */
interface AirtableData {
  base_id: string;
  table_name: string;
  action: 'list' | 'get' | 'create' | 'update' | 'delete';
  record_id?: string;
  fields?: Record<string, any>;
  filter_by_formula?: string;
  max_records?: number;
  sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
}

/**
 * Interface for Airtable record
 */
interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

/**
 * Base URL for Airtable API
 */
const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';

/**
 * Airtable Provider
 *
 * Airtable is a cloud-based database and spreadsheet hybrid platform.
 * This provider handles record operations on Airtable bases.
 *
 * @see https://airtable.com/developers/web/api/introduction
 */
@ThirdParty({
  identifier: 'airtable',
  title: 'Airtable',
  description: 'Connect to Airtable databases and spreadsheets',
  position: 'webhook',
  fields: [],
})
export class AirtableProvider extends ThirdPartyAbstract<AirtableData> {
  /**
   * Check if the API key is valid by listing bases
   *
   * @param apiKey - Airtable API key
   * @returns Connection information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch('https://api.airtable.com/v0/meta/bases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: 'Airtable',
        username: 'airtable',
        id: data.bases?.[0]?.id || 'airtable',
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get accessible bases
   *
   * @param apiKey - Airtable API key
   * @returns List of bases
   */
  async bases(apiKey: string): Promise<any[]> {
    try {
      const response = await fetch('https://api.airtable.com/v0/meta/bases', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bases');
      }

      const data = await response.json();
      return data.bases || [];
    } catch (error) {
      throw new Error(`Failed to fetch bases: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Perform action on Airtable
   *
   * @param apiKey - Airtable API key
   * @param data - Action data
   * @returns Result message
   */
  async sendData(
    apiKey: string,
    data: AirtableData
  ): Promise<string> {
    try {
      switch (data.action) {
        case 'list':
          return await this.listRecords(apiKey, data);
        case 'get':
          return await this.getRecord(apiKey, data);
        case 'create':
          return await this.createRecord(apiKey, data);
        case 'update':
          return await this.updateRecord(apiKey, data);
        case 'delete':
          return await this.deleteRecord(apiKey, data);
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      throw new Error(`Failed to perform Airtable action: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * List records from Airtable table
   */
  private async listRecords(apiKey: string, data: AirtableData): Promise<string> {
    const params = new URLSearchParams();

    if (data.filter_by_formula) {
      params.append('filterByFormula', data.filter_by_formula);
    }
    if (data.max_records) {
      params.append('maxRecords', data.max_records.toString());
    }
    if (data.sort) {
      data.sort.forEach((sort, index) => {
        params.append(`sort[${index}][field]`, sort.field);
        params.append(`sort[${index}][direction]`, sort.direction);
      });
    }

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${data.base_id}/${encodeURIComponent(data.table_name)}?${params}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to list records');
    }

    const result = await response.json();
    return JSON.stringify(result.records || [], null, 2);
  }

  /**
   * Get a single record from Airtable
   */
  private async getRecord(apiKey: string, data: AirtableData): Promise<string> {
    if (!data.record_id) {
      throw new Error('record_id is required for get action');
    }

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${data.base_id}/${encodeURIComponent(data.table_name)}/${data.record_id}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to get record');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Create a new record in Airtable
   */
  private async createRecord(apiKey: string, data: AirtableData): Promise<string> {
    if (!data.fields) {
      throw new Error('fields is required for create action');
    }

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${data.base_id}/${encodeURIComponent(data.table_name)}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: data.fields,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create record');
    }

    const result = await response.json();
    return `Record created successfully: ${result.id}`;
  }

  /**
   * Update an existing record in Airtable
   */
  private async updateRecord(apiKey: string, data: AirtableData): Promise<string> {
    if (!data.record_id) {
      throw new Error('record_id is required for update action');
    }
    if (!data.fields) {
      throw new Error('fields is required for update action');
    }

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${data.base_id}/${encodeURIComponent(data.table_name)}/${data.record_id}`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: data.fields,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to update record');
    }

    const result = await response.json();
    return `Record updated successfully: ${result.id}`;
  }

  /**
   * Delete a record from Airtable
   */
  private async deleteRecord(apiKey: string, data: AirtableData): Promise<string> {
    if (!data.record_id) {
      throw new Error('record_id is required for delete action');
    }

    const response = await fetch(
      `${AIRTABLE_BASE_URL}/${data.base_id}/${encodeURIComponent(data.table_name)}/${data.record_id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to delete record');
    }

    const result = await response.json();
    return `Record deleted successfully: ${result.id}`;
  }
}
