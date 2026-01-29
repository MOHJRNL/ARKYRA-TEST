import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { timer } from '@gitroom/helpers/utils/timer';

/**
 * Interface for PlayHT audio data
 */
interface PlayHTAudioData {
  text: string;
  voice: string;
  quality?: 'draft' | 'low' | 'medium' | 'high' | 'premium';
  output_format?: 'mp3' | 'wav' | 'ogg' | 'flac';
  speed?: number;
  temperature?: number;
}

/**
 * Interface for PlayHT voice
 */
interface PlayHTVoice {
  id: string;
  name: string;
  language: string;
  gender?: string;
  accent?: string;
  sample?: string;
}

/**
 * Base URL for PlayHT API
 */
const PLAYHT_BASE_URL = 'https://api.play.ht/api/v2';

/**
 * PlayHT Provider
 *
 * PlayHT is an ultra-realistic AI voice generation platform.
 * This provider handles text-to-speech generation with natural-sounding voices.
 *
 * @see https://docs.play.ht/
 */
@ThirdParty({
  identifier: 'playht',
  title: 'PlayHT',
  description: 'Ultra-realistic AI voice generation platform',
  position: 'media',
  fields: [],
})
export class PlayHTProvider extends ThirdPartyAbstract<PlayHTAudioData> {
  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - PlayHT API key (format: "userId:secretKey")
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const [userId, secretKey] = apiKey.split(':');

      if (!userId || !secretKey) {
        return false;
      }

      const response = await fetch(`${PLAYHT_BASE_URL}/usage`, {
        method: 'GET',
        headers: {
          'X-USER-ID': userId,
          'AUTHORIZATION': secretKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: 'PlayHT User',
        username: userId,
        id: userId,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available voices from PlayHT
   *
   * @param apiKey - PlayHT API key
   * @returns List of available voices
   */
  async voices(apiKey: string): Promise<PlayHTVoice[]> {
    try {
      const [userId, secretKey] = apiKey.split(':');

      const response = await fetch(`${PLAYHT_BASE_URL}/voices`, {
        method: 'GET',
        headers: {
          'X-USER-ID': userId,
          'AUTHORIZATION': secretKey,
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
   * Generate audio with PlayHT
   *
   * @param apiKey - PlayHT API key
   * @param data - Audio generation data
   * @returns URL of the generated audio
   */
  async sendData(
    apiKey: string,
    data: PlayHTAudioData
  ): Promise<string> {
    try {
      const [userId, secretKey] = apiKey.split(':');

      // Create TTS job
      const createResponse = await fetch(`${this.baseUrl}/tts`, {
        method: 'POST',
        headers: {
          'X-USER-ID': userId,
          'AUTHORIZATION': secretKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          voice: data.voice,
          quality: data.quality || 'medium',
          output_format: data.output_format || 'mp3',
          speed: data.speed || 1,
          temperature: data.temperature,
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.error_message || 'Failed to create TTS job');
      }

      const { id: jobId } = await createResponse.json();

      // Poll for job completion
      let attempts = 0;
      const maxAttempts = 60; // 3 minutes max

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/tts/${jobId}`, {
          method: 'GET',
          headers: {
            'X-USER-ID': userId,
            'AUTHORIZATION': secretKey,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check TTS status');
        }

        const statusData = await statusResponse.json();

        if (statusData.output && statusData.output.url) {
          return statusData.output.url;
        } else if (statusData.error) {
          throw new Error(statusData.error);
        }

        await timer(3000);
        attempts++;
      }

      throw new Error('TTS generation timeout');
    } catch (error) {
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
