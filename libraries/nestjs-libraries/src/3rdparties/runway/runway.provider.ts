import {
  ThirdParty,
  ThirdPartyAbstract,
} from '@gitroom/nestjs-libraries/3rdparties/thirdparty.interface';
import { timer } from '@gitroom/helpers/utils/timer';

/**
 * Interface for Runway generation data
 */
interface RunwayGenerationData {
  model: 'gen3' | 'gen2' | 'gen1';
  prompt: string;
  image?: string; // Base64 or URL
  duration?: number; // 5 or 10 seconds
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  style?: string;
}

/**
 * Interface for Runway task
 */
interface RunwayTask {
  id: string;
  status: 'pending' | 'running' | 'succeeded' | 'failed';
  output?: string[];
  failure?: string;
}

/**
 * Base URL for Runway API
 */
const RUNWAY_BASE_URL = 'https://api.runwayml.com/v1';

/**
 * Runway Provider
 *
 * Runway is an AI platform for creative video generation.
 * This provider handles text-to-video, image-to-video, and AI video generation.
 *
 * @see https://docs.runwayml.com/
 */
@ThirdParty({
  identifier: 'runway',
  title: 'Runway',
  description: 'AI-powered creative video generation platform',
  position: 'media',
  fields: [],
})
export class RunwayProvider extends ThirdPartyAbstract<RunwayGenerationData> {
  /**
   * Check if the API key is valid by fetching user information
   *
   * @param apiKey - Runway API key
   * @returns User information or false if invalid
   */
  async checkConnection(
    apiKey: string
  ): Promise<false | { name: string; username: string; id: string }> {
    try {
      const response = await fetch(`${RUNWAY_BASE_URL}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      return {
        name: data.name || 'Runway User',
        username: data.email || data.id,
        id: data.id,
      };
    } catch (error) {
      return false;
    }
  }

  /**
   * Get available models from Runway
   *
   * @param apiKey - Runway API key
   * @returns List of available models
   */
  async models(apiKey: string): Promise<string[]> {
    try {
      const response = await fetch(`${RUNWAY_BASE_URL}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch models');
      }

      const data = await response.json();
      return data.models || ['gen3', 'gen2', 'gen1'];
    } catch (error) {
      // Return default models if API call fails
      return ['gen3', 'gen2', 'gen1'];
    }
  }

  /**
   * Generate a video with Runway
   *
   * @param apiKey - Runway API key
   * @param data - Generation data
   * @returns URL of the generated video
   */
  async sendData(
    apiKey: string,
    data: RunwayGenerationData
  ): Promise<string> {
    try {
      // Create generation task
      const createResponse = await fetch(`${this.baseUrl}/generations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: data.model || 'gen3',
          prompt: data.prompt,
          ...(data.image && { image: data.image }),
          duration: data.duration || 5,
          aspect_ratio: data.aspect_ratio || '16:9',
          ...(data.style && { style: data.style }),
        }),
      });

      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        throw new Error(errorData.message || 'Failed to create generation');
      }

      const { id: taskId } = await createResponse.json();

      // Poll for generation completion
      let attempts = 0;
      const maxAttempts = 300; // 15 minutes max for video generation

      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/generations/${taskId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        });

        if (!statusResponse.ok) {
          throw new Error('Failed to check generation status');
        }

        const statusData: RunwayTask = await statusResponse.json();

        if (statusData.status === 'succeeded') {
          if (!statusData.output || statusData.output.length === 0) {
            throw new Error('No output generated');
          }
          return statusData.output[0];
        } else if (statusData.status === 'failed') {
          throw new Error(statusData.failure || 'Generation failed');
        }

        await timer(3000);
        attempts++;
      }

      throw new Error('Generation timeout');
    } catch (error) {
      throw new Error(`Failed to generate video: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
