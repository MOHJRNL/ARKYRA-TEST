import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { timer } from '@gitroom/helpers/utils/timer';

/**
 * Interface for Synthesia video data
 */
interface SynthesiaVideoData {
  title: string;
  description?: string;
  script: string;
  avatar: string;
  voice: string;
  background?: string;
  visibility: 'public' | 'private';
}

/**
 * Interface for Synthesia avatar
 */
interface SynthesiaAvatar {
  id: string;
  name: string;
  preview_url?: string;
  is_public: boolean;
}

/**
 * Interface for Synthesia voice
 */
interface SynthesiaVoice {
  id: string;
  name: string;
  language: string;
  gender?: string;
}

/**
 * Synthesia Provider
 *
 * Synthesia is an AI video generation platform that creates professional videos
 * with AI avatars and voiceovers. This provider handles video creation, avatar
 * management, and voice selection.
 *
 * @see https://docs.synthesia.io/
 */
@ThirdParty({
  identifier: 'synthesia',
  title: 'Synthesia',
  description: 'Create professional AI videos with avatars and voiceovers',
  position: 'media',
  fields: [],
})
export class SynthesiaProvider extends ThirdPartyAbstract<SynthesiaVideoData> {
  private readonly baseUrl = 'https://api.synthesia.io/v2';

  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - Synthesia API key
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: data.name || 'Synthesia User',
        username: data.email || data.id,
        id: data.id,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available avatars from Synthesia
   *
   * @param apiKey - Synthesia API key
   * @returns List of available avatars
   */
  async avatars(apiKey: string): Promise<SynthesiaAvatar[]> {
    try {
      const response = await fetch(`${this.baseUrl}/avatars`, {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch avatars');
      }

      const data = await response.json();
      return data.avatars || [];
    } catch (error) {
      throw new Error(`Failed to fetch avatars: ${error.message}`);
    }
  }

  /**
   * Get available voices from Synthesia
   *
   * @param apiKey - Synthesia API key
   * @returns List of available voices
   */
  async voices(apiKey: string): Promise<SynthesiaVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      throw new Error(`Failed to fetch voices: ${error.message}`);
    }
  }

  /**
   * Create a video with Synthesia
   *
   * @param apiKey - Synthesia API key
   * @param data - Video creation data
   * @returns URL of the generated video
   */
  async sendData(
    apiKey: string,
    data: SynthesiaVideoData
  ): Promise<string> {
    try {
      // Create video
      const createResponse = await fetch(`${this.baseUrl}/videos`, {
        method: 'POST',
        headers: {
          'Authorization': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          visibility: data.visibility || 'private',
          input: [
            {
              avatarSettings: {
                avatarId: data.avatar,
                voice: data.voice,
              },
              script: data.script,
              background: data.background || 'green_screen',
            },
          ],
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create video');
      }

      const { id: videoId } = await createResponse.json();

      // Poll for video completion
      let attempts = 0;
      const maxAttempts = 200; // 10 minutes max

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/videos/${videoId}`, {
          method: 'GET',
          headers: {
            'Authorization': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check video status');
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'complete') {
          return statusData.download || statusData.url;
        } else if (statusData.status === 'failed') {
          throw new Error('Video generation failed');
        }

        await timer(3000);
        attempts++;
      }

      throw new Error('Video generation timeout');
    } catch (error) {
      throw new Error(`Failed to create video: ${error.message}`);
    }
  }
}
