import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { timer } from '@gitroom/helpers/utils/timer';

/**
 * Interface for Murf audio data
 */
interface MurfAudioData {
  text: string;
  voice_id: string;
  format?: 'mp3' | 'wav' | 'flac';
  speed?: number;
  pitch?: number;
  emphasis?: 'none' | 'low' | 'medium' | 'high';
}

/**
 * Interface for Murf voice
 */
interface MurfVoice {
  voice_id: string;
  name: string;
  language: string;
  gender?: string;
  style?: string;
  preview_url?: string;
}

/**
 * Base URL for Murf API
 */
const MURF_BASE_URL = 'https://api.murf.ai/v1';

/**
 * Murf Provider
 *
 * Murf AI is a studio-quality AI voice generation platform.
 * This provider handles text-to-speech generation with professional voiceovers.
 *
 * @see https://docs.murf.ai/
 */
@ThirdParty({
  identifier: 'murf',
  title: 'Murf AI',
  description: 'Studio-quality AI voiceovers and text-to-speech',
  position: 'media',
  fields: [],
})
export class MurfProvider extends ThirdPartyAbstract<MurfAudioData> {
  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - Murf API key
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${MURF_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: data.name || 'Murf User',
        username: data.email || data.user_id,
        id: data.user_id || data.id,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available voices from Murf
   *
   * @param apiKey - Murf API key
   * @returns List of available voices
   */
  async voices(apiKey: string): Promise<MurfVoice[]> {
    try {
      const response = await fetch(`${MURF_BASE_URL}/voices`, {
        method: 'GET',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Generate audio with Murf
   *
   * @param apiKey - Murf API key
   * @param data - Audio generation data
   * @returns URL of the generated audio
   */
  async sendData(
    apiKey: string,
    data: MurfAudioData
  ): Promise<string> {
    try {
      // Create speech generation job
      const createResponse = await fetch(`${this.baseUrl}/speech`, {
        method: 'POST',
        headers: {
          'api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voice_id: data.voice_id,
          text: data.text,
          format: data.format || 'mp3',
          speed: data.speed || 1.0,
          pitch: data.pitch || 0,
          emphasis: data.emphasis || 'none',
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create speech');
      }

      const { job_id } = await createResponse.json();

      // Poll for job completion
      let attempts = 0;
      const maxAttempts = 60; // 3 minutes max

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/speech/${job_id}`, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check speech status');
        }

        const statusData = await statusResponse.json();

        if (statusData.status === 'completed') {
          return statusData.audio_url;
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.error || 'Speech generation failed');
        }

        await timer(3000);
        attempts++;
      }

      throw new Error('Speech generation timeout');
    } catch (error) {
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
