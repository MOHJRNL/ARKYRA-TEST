import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { timer } from '@gitroom/helpers/utils/timer';

/**
 * Interface for D-ID talk data
 */
interface DIdTalkData {
  source_url: string;
  script: string;
  voice_id?: string;
  driver_url?: string;
  config?: {
    fluent?: boolean;
    pad_audio?: number;
    stitch?: boolean;
  };
}

/**
 * Interface for D-ID presenter
 */
interface DIdPresenter {
  presenter_id: string;
  name: string;
  thumbnail_url: string;
  created_at: string;
}

/**
 * Interface for D-ID voice
 */
interface DIdVoice {
  voice_id: string;
  name: string;
  language: string;
  provider: string;
  gender?: string;
}

/**
 * Base URL for D-ID API
 */
const DID_BASE_URL = 'https://api.d-id.com';

/**
 * D-ID Provider
 *
 * D-ID is an AI platform for creating talking avatars from photos.
 * This provider handles talk creation, presenter management, and voice selection.
 *
 * @see https://docs.d-id.com/
 */
@ThirdParty({
  identifier: 'd-id',
  title: 'D-ID',
  description: 'Create talking avatars from photos with AI',
  position: 'media',
  fields: [],
})
export class DIdProvider extends ThirdPartyAbstract<DIdTalkData> {
  /**
   * Check if the API key is valid by fetching credits information
   *
   * @param apiKey - D-ID API key
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${DID_BASE_URL}/credits`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: 'D-ID User',
        username: data.owner || 'user',
        id: data.owner || 'user',
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available presenters from D-ID
   *
   * @param apiKey - D-ID API key
   * @returns List of available presenters
   */
  async presenters(apiKey: string): Promise<DIdPresenter[]> {
    try {
      const response = await fetch(`${DID_BASE_URL}/images`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch presenters');
      }

      const data = await response.json();
      return data.images || [];
    } catch (error) {
      throw new Error(`Failed to fetch presenters: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get available voices from D-ID
   *
   * @param apiKey - D-ID API key
   * @returns List of available voices
   */
  async voices(apiKey: string): Promise<DIdVoice[]> {
    try {
      const response = await fetch(`${DID_BASE_URL}/tts/voices`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a talking avatar with D-ID
   *
   * @param apiKey - D-ID API key
   * @param data - Talk creation data
   * @returns URL of the generated video
   */
  async sendData(
    apiKey: string,
    data: DIdTalkData
  ): Promise<string> {
    try {
      // Create talk
      const createResponse = await fetch(`${this.baseUrl}/talks`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source_url: data.source_url,
          script: {
            type: 'text',
            input: data.script,
            provider: {
              type: 'microsoft',
              voice_id: data.voice_id || 'en-US-JennyNeural',
            },
          },
          config: data.config || {
            fluent: true,
            pad_audio: 0,
            stitch: true,
          },
          driver_url: data.driver_url,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create talk');
      }

      const { id: talkId } = await createResponse.json();

      // Poll for talk completion
      let attempts = 0;
      const maxAttempts = 200; // 10 minutes max

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/talks/${talkId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Basic ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check talk status');
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'done') {
          return statusData.result_url;
        } else if (statusData.status === 'error') {
          throw new Error(statusData.error?.description || 'Talk generation failed');
        }

        await timer(3000);
        attempts++;
      }

      throw new Error('Talk generation timeout');
    } catch (error) {
      throw new Error(`Failed to create talk: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
