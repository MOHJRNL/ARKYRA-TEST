import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for Notion data
 */
interface NotionData {
  database_id?: string;
  page_id?: string;
  action: 'create_page' | 'update_page' | 'query_database' | 'create_database';
  properties?: Record<string, any>;
  children?: any[];
  filter?: any;
  sorts?: any[];
}

/**
 * Interface for Notion database
 */
interface NotionDatabase {
  id: string;
  title: string;
  properties: Record<string, any>;
}

/**
 * Notion Provider
 *
 * Notion is an all-in-one workspace for notes, tasks, wikis, and databases.
 * This provider handles page and database operations.
 *
 * @see https://developers.notion.com/
 */
@ThirdParty({
  identifier: 'notion',
  title: 'Notion',
  description: 'Connect to Notion workspace for pages and databases',
  position: 'webhook',
  fields: [],
})
export class NotionProvider extends ThirdPartyAbstract<NotionData> {
  private readonly baseUrl: string = 'https://api.notion.com/v1';
  private readonly notionVersion: string = '2022-06-28';

  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - Notion integration token
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': this.notionVersion,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: data.name || 'Notion User',
        username: data.person?.email || data.id,
        id: data.id,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get accessible databases
   *
   * @param apiKey - Notion integration token
   * @returns List of databases
   */
  async databases(apiKey: string): Promise<NotionDatabase[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': this.notionVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: {
            value: 'database',
            property: 'object',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch databases');
      }

      const data = await response.json();
      return data.results || [];
    } catch (error) {
      throw new Error(`Failed to fetch databases: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Perform action on Notion
   *
   * @param apiKey - Notion integration token
   * @param data - Action data
   * @returns Result message
   */
  async sendData(
    apiKey: string,
    data: NotionData
  ): Promise<string> {
    try {
      switch (data.action) {
        case 'create_page':
          return await this.createPage(apiKey, data);
        case 'update_page':
          return await this.updatePage(apiKey, data);
        case 'query_database':
          return await this.queryDatabase(apiKey, data);
        case 'create_database':
          return await this.createDatabase(apiKey, data);
        default:
          throw new Error(`Unknown action: ${data.action}`);
      }
    } catch (error) {
      throw new Error(`Failed to perform Notion action: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a new page in Notion
   */
  private async createPage(apiKey: string, data: NotionData): Promise<string> {
    const response = await fetch(`${this.baseUrl}/pages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': this.notionVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: data.database_id
          ? { database_id: data.database_id }
          : { page_id: data.page_id },
        properties: data.properties || {},
        children: data.children || [],
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create page');
    }

    const result = await response.json();
    return `Page created successfully: ${result.id}`;
  }

  /**
   * Update an existing page in Notion
   */
  private async updatePage(apiKey: string, data: NotionData): Promise<string> {
    if (!data.page_id) {
      throw new Error('page_id is required for update_page action');
    }

    const response = await fetch(`${this.baseUrl}/pages/${data.page_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': this.notionVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: data.properties || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update page');
    }

    const result = await response.json();
    return `Page updated successfully: ${result.id}`;
  }

  /**
   * Query a database in Notion
   */
  private async queryDatabase(apiKey: string, data: NotionData): Promise<string> {
    if (!data.database_id) {
      throw new Error('database_id is required for query_database action');
    }

    const response = await fetch(
      `${this.baseUrl}/databases/${data.database_id}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Notion-Version': this.notionVersion,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filter: data.filter,
          sorts: data.sorts,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to query database');
    }

    const result = await response.json();
    return JSON.stringify(result, null, 2);
  }

  /**
   * Create a new database in Notion
   */
  private async createDatabase(apiKey: string, data: NotionData): Promise<string> {
    if (!data.page_id) {
      throw new Error('page_id is required for create_database action');
    }

    const response = await fetch(`${this.baseUrl}/databases`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Notion-Version': this.notionVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { page_id: data.page_id },
        properties: data.properties || {},
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create database');
    }

    const result = await response.json();
    return `Database created successfully: ${result.id}`;
  }
}
