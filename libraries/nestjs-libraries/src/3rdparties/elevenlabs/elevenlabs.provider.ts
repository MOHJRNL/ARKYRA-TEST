import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';

/**
 * Interface for ElevenLabs audio data
 */
interface ElevenLabsAudioData {
  text: string;
  voice_id: string;
  model_id?: string;
  voice_settings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

/**
 * Interface for ElevenLabs voice
 */
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  preview_url?: string;
  category?: string;
  labels?: Record<string, string>;
}

/**
 * ElevenLabs Provider
 *
 * ElevenLabs is an AI audio platform for creating realistic AI voices
 * with emotional control. This provider handles text-to-speech generation
 * and voice management.
 *
 * @see https://docs.elevenlabs.io/
 */
@ThirdParty({
  identifier: 'elevenlabs',
  title: 'ElevenLabs',
  description: 'Realistic AI voice generation with emotional control',
  position: 'media',
  fields: [],
})
export class ElevenLabsProvider extends ThirdPartyAbstract<ElevenLabsAudioData> {
  private readonly baseUrl = 'https://api.elevenlabs.io/v1';

  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - ElevenLabs API key
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: data.name || 'ElevenLabs User',
        username: data.email || data.subscription?.tier || 'user',
        id: data.xi_user_id || 'user',
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available voices from ElevenLabs
   *
   * @param apiKey - ElevenLabs API key
   * @returns List of available voices
   */
  async voices(apiKey: string): Promise<ElevenLabsVoice[]> {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
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
   * Get available models from ElevenLabs
   *
   * @param apiKey - ElevenLabs API key
   * @returns List of available models
   */
  async models(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        method: 'GET',
        headers: {
          'xi-api-key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      return data.map((model: any) => model.model_id) || [];
    } catch (error) {
      // Return default models if API call fails
      return ['eleven_monolingual_v1', 'eleven_multilingual_v2'];
    }
  }

  /**
   * Generate audio with ElevenLabs
   *
   * @param apiKey - ElevenLabs API key
   * @param data - Audio generation data
   * @returns URL of the generated audio (base64 data URL)
   */
  async sendData(
    apiKey: string,
    data: ElevenLabsAudioData
  ): Promise<string> {
    try {
      const response = await fetch(
        `${this.baseUrl}/text-to-speech/${data.voice_id}`,
        {
          method: 'POST',
          headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.text,
            model_id: data.model_id || 'eleven_monolingual_v1',
            voice_settings: data.voice_settings || {
              stability: 0.5,
              similarity_boost: 0.75,
              style: 0,
              use_speaker_boost: true,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.message || 'Failed to generate audio');
      }

      // Get audio as buffer
      const audioBuffer = await response.arrayBuffer();

      // Convert to base64 data URL
      const base64Audio = Buffer.from(audioBuffer).toString('base64');
      return `data:audio/mpeg;base64,${base64Audio}`;
    } catch (error) {
      throw new Error(`Failed to generate audio: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
