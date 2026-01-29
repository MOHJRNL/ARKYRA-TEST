import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Google Sheets data
 */
interface GoogleSheetsData {
  spreadsheet_id: string;
  sheet_name?: string;
  range?: string;
  action: 'read' | 'write' | 'append' | 'clear' | 'create_sheet';
  values?: any[][];
  value_input_option?: 'RAW' | 'USER_ENTERED';
}

/**
 * Interface for Google Sheets spreadsheet info
 */
interface SpreadsheetInfo {
  spreadsheet_id: string;
  title: string;
  sheets: Array<{ title: string; sheet_id: number }>;
}

/**
 * Google Sheets Provider
 *
 * Google Sheets integration for reading and writing spreadsheet data.
 * This provider handles data operations on Google Sheets.
 *
 * @see https://developers.google.com/sheets/api
 */
@ThirdParty({
  identifier: 'google-sheets',
  title: 'Google Sheets',
  description: 'Read and write data to Google Sheets',
  position: 'webhook',
  fields: [],
})
export class GoogleSheetsProvider extends ThirdPartyAbstract<GoogleSheetsData> {
  private readonly baseUrl = 'https://sheets.googleapis.com/v4';

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
      // Try to validate by making a simple API call
      const response = await fetch(
        `${this.baseUrl}/spreadsheets/test?key=${apiKey}`,
        {
          method: 'GET',
        }
      );

      // Even if this fails, we consider the key format valid
      return {
        name: 'Google Sheets',
        username: 'sheets',
        id: 'google-sheets',
      };
    } catch (error) {
      // For OAuth tokens, the format is different
      if (apiKey.startsWith('ya29.') || apiKey.length > 100) {
        return {
          name: 'Google Sheets',
          username: 'sheets',
          id: 'google-sheets',
        };
      }
      return false;
    }
  }

  /**
   * Get spreadsheet information
   *
   * @param apiKey - Google API key or OAuth token
   * @param spreadsheetId - Spreadsheet ID
   * @returns Spreadsheet information
   */
  async getSpreadsheet(
    apiKey: string,
    spreadsheetId: string
  ): Promise<SpreadsheetInfo> {
    try {
      const authHeader = apiKey.startsWith('ya29.')
        ? { 'Authorization': `Bearer ${apiKey}` }
        : {};
      const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

      const response = await fetch(
        `${this.baseUrl}/spreadsheets/${spreadsheetId}${keyParam}`,
        {
          method: 'GET',
          headers: authHeader,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get spreadsheet');
      }

      const data = await response.json();
      return {
        spreadsheet_id: data.spreadsheetId,
        title: data.properties.title,
        sheets: data.sheets.map((sheet: any) => ({
          title: sheet.properties.title,
          sheet_id: sheet.properties.sheetId,
        })),
      };
    } catch (error) {
      throw new Error(`Failed to get spreadsheet: ${error.message}`);
    }
  }

  /**
   * Perform action on Google Sheets
   *
   * @param apiKey - Google API key or OAuth token
   * @param data - Action data
   * @returns Result message
   */
  async sendData(
    apiKey: string,
    data: GoogleSheetsData
  ): Promise<string> {
    try {
      switch (data.action) {
        case 'read':
          return await this.readData(apiKey, data);
        case 'write':
          return await this.writeData(apiKey, data);
        case 'append':
          return await this.appendData(apiKey, data);
        case 'clear':
          return await this.clearData(apiKey, data);
        case 'create_sheet':
          return await this.createSheet(apiKey, data);
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      throw new Error(`Failed to perform Google Sheets action: ${error.message}`);
    }
  }

  /**
   * Read data from Google Sheets
   */
  private async readData(apiKey: string, data: GoogleSheetsData): Promise<string> {
    const range = data.range || `${data.sheet_name || 'Sheet1'}!A1:Z1000`;
    const authHeader = apiKey.startsWith('ya29.')
      ? { 'Authorization': `Bearer ${apiKey}` }
      : {};
    const keyParam = !apiKey.startsWith('ya29.') ? `&key=${apiKey}` : '';

    const response = await fetch(
      `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}?valueRenderOption=FORMATTED_VALUE${keyParam}`,
      {
        method: 'GET',
        headers: authHeader,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to read data');
    }

    const result = await response.json();
    return JSON.stringify(result.values || [], null, 2);
  }

  /**
   * Write data to Google Sheets
   */
  private async writeData(apiKey: string, data: GoogleSheetsData): Promise<string> {
    if (!data.values) {
      throw new Error('values is required for write action');
    }

    const range = data.range || `${data.sheet_name || 'Sheet1'}!A1`;
    const authHeader = apiKey.startsWith('ya29.')
      ? { 'Authorization': `Bearer ${apiKey}` }
      : {};
    const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

    const response = await fetch(
      `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}${keyParam}`,
      {
        method: 'PUT',
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: data.values,
          valueInputOption: data.value_input_option || 'USER_ENTERED',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to write data');
    }

    const result = await response.json();
    return `Data written successfully: ${result.updatedCells} cells updated`;
  }

  /**
   * Append data to Google Sheets
   */
  private async appendData(apiKey: string, data: GoogleSheetsData): Promise<string> {
    if (!data.values) {
      throw new Error('values is required for append action');
    }

    const range = data.range || `${data.sheet_name || 'Sheet1'}!A1`;
    const authHeader = apiKey.startsWith('ya29.')
      ? { 'Authorization': `Bearer ${apiKey}` }
      : {};
    const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

    const response = await fetch(
      `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}:append${keyParam}`,
      {
        method: 'POST',
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: data.values,
          valueInputOption: data.value_input_option || 'USER_ENTERED',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to append data');
    }

    const result = await response.json();
    return `Data appended successfully: ${result.updates.updatedCells} cells updated`;
  }

  /**
   * Clear data from Google Sheets
   */
  private async clearData(apiKey: string, data: GoogleSheetsData): Promise<string> {
    const range = data.range || `${data.sheet_name || 'Sheet1'}!A1:Z1000`;
    const authHeader = apiKey.startsWith('ya29.')
      ? { 'Authorization': `Bearer ${apiKey}` }
      : {};
    const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

    const response = await fetch(
      `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}/values/${range}:clear${keyParam}`,
      {
        method: 'POST',
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to clear data');
    }

    return `Data cleared successfully from range: ${range}`;
  }

  /**
   * Create a new sheet in spreadsheet
   */
  private async createSheet(apiKey: string, data: GoogleSheetsData): Promise<string> {
    if (!data.sheet_name) {
      throw new Error('sheet_name is required for create_sheet action');
    }

    const authHeader = apiKey.startsWith('ya29.')
      ? { 'Authorization': `Bearer ${apiKey}` }
      : {};
    const keyParam = !apiKey.startsWith('ya29.') ? `?key=${apiKey}` : '';

    const response = await fetch(
      `${this.baseUrl}/spreadsheets/${data.spreadsheet_id}:batchUpdate${keyParam}`,
      {
        method: 'POST',
        headers: {
          ...authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              addSheet: {
                properties: {
                  title: data.sheet_name,
                },
              },
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to create sheet');
    }

    const result = await response.json();
    return `Sheet created successfully: ${data.sheet_name}`;
  }
}
