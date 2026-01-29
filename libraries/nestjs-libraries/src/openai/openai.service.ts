import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { shuffle } from 'lodash';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { AIProviderService, AIProvider } from '../ai/ai.provider.service';
import {
  isDemoMode,
  DEMO_RESPONSES,
  logDemoModeWarning
} from '../ai-router/config/demo-mode.config';

// Check if demo mode is enabled
const DEMO_MODE = isDemoMode();

// Initialize OpenAI client (will be in demo mode if no API key)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-demo-key',
});

/**
 * OpenAI Service
 * 
 * This service provides AI-powered features for ARKYRA.
 * It now supports multiple AI providers through AIProviderService.
 * 
 * Supported Providers:
 * - OpenAI (GPT-4.1, DALL-E 3)
 * - Google Gemini (Recommended for cost-effectiveness)
 * - Anthropic Claude (Best for long-form content)
 * - Groq (Fastest inference)
 * - Mistral AI (European alternative)
 * 
 * See AI_MODELS_GUIDE.md for detailed provider comparison and setup.
 */

const PicturePrompt = z.object({
  prompt: z.string(),
});

const VoicePrompt = z.object({
  voice: z.string(),
});

@Injectable()
export class OpenaiService {
  private readonly logger = new Logger(OpenaiService.name);

  async generateImage(prompt: string, isUrl: boolean, isVertical = false) {
    // Demo mode: return placeholder image
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'generateImage');
      return isVertical ? DEMO_RESPONSES.imageUrlVertical : DEMO_RESPONSES.imageUrl;
    }

    try {
      const generate = (
        await openai.images.generate({
          prompt,
          response_format: isUrl ? 'url' : 'b64_json',
          model: 'dall-e-3',
          ...(isVertical ? { size: '1024x1792' } : {}),
        })
      ).data[0];

      return isUrl ? generate.url : generate.b64_json;
    } catch (error) {
      this.logger.error(`Image generation failed: ${(error as any).message}`, (error as any).stack);
      // Fallback to demo image on error
      return isVertical ? DEMO_RESPONSES.imageUrlVertical : DEMO_RESPONSES.imageUrl;
    }
  }

  async generatePromptForPicture(prompt: string) {
    // Demo mode: return sample prompt
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'generatePromptForPicture');
      return DEMO_RESPONSES.imagePrompt;
    }

    try {
      return (
        (
          await openai.chat.completions.parse({
            model: 'gpt-4.1',
            messages: [
              {
                role: 'system',
                content: `You are an assistant that take a description and style and generate a prompt that will be used later to generate images, make it a very long and descriptive explanation, and write a lot of things for the renderer like, if it${"'"}s realistic describe the camera`,
              },
              {
                role: 'user',
                content: `prompt: ${prompt}`,
              },
            ],
            response_format: zodResponseFormat(PicturePrompt, 'picturePrompt'),
          })
        ).choices[0].message.parsed?.prompt || ''
      );
    } catch (error) {
      this.logger.error(`Prompt generation failed: ${(error as any).message}`);
      return DEMO_RESPONSES.imagePrompt;
    }
  }

  async generateVoiceFromText(prompt: string) {
    // Demo mode: return sample voice text
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'generateVoiceFromText');
      return DEMO_RESPONSES.voice;
    }

    try {
      return (
        (
          await openai.chat.completions.parse({
            model: 'gpt-4.1',
            messages: [
              {
                role: 'system',
                content: `You are an assistant that takes a social media post and convert it to a normal human voice, to be later added to a character, when a person talk they don\'t use "-", and sometimes they add pause with "..." to make it sounds more natural, make sure you use a lot of pauses and make it sound like a real person`,
              },
              {
                role: 'user',
                content: `prompt: ${prompt}`,
              },
            ],
            response_format: zodResponseFormat(VoicePrompt, 'voice'),
          })
        ).choices[0].message.parsed?.voice || ''
      );
    } catch (error) {
      this.logger.error(`Voice generation failed: ${(error as any).message}`);
      return DEMO_RESPONSES.voice;
    }
  }

  async generatePosts(content: string) {
    // Demo mode: return sample posts
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'generatePosts');
      return [
        [{ post: DEMO_RESPONSES.completion.social_media_post }],
        DEMO_RESPONSES.completion.thread.map(t => ({ post: t })),
        [{ post: "Demo post 1: " + content.substring(0, 100) + "..." }],
        [{ post: "Demo post 2: Exploring the possibilities with ARKYRA" }],
        [{ post: "Demo post 3: Add your API key to unlock real AI content generation" }],
      ];
    }

    try {
      const posts = (
        await Promise.all([
          openai.chat.completions.create({
            messages: [
              {
                role: 'assistant',
                content:
                  'Generate a Twitter post from the content without emojis in the following JSON format: { "post": string } put it in an array with one element',
              },
              {
                role: 'user',
                content: content!,
              },
            ],
            n: 5,
            temperature: 1,
            model: 'gpt-4.1',
          }),
          openai.chat.completions.create({
            messages: [
              {
                role: 'assistant',
                content:
                  'Generate a thread for social media in the following JSON format: Array<{ "post": string }> without emojis',
              },
              {
                role: 'user',
                content: content!,
              },
            ],
            n: 5,
            temperature: 1,
            model: 'gpt-4.1',
          }),
        ])
      ).flatMap((p) => p.choices);

      return shuffle(
        posts.map((choice) => {
          const { content } = choice.message;
          const start = content?.indexOf('[')!;
          const end = content?.lastIndexOf(']')!;
          try {
            return JSON.parse(
              '[' +
                content
                  ?.slice(start + 1, end)
                  .replace(/\n/g, ' ')
                  .replace(/ {2,}/g, ' ') +
                ']'
            );
          } catch (e) {
            return [];
          }
        })
      );
    } catch (error) {
      this.logger.error(`Post generation failed: ${(error as any).message}`);
      // Return demo posts on error
      return [
        [{ post: DEMO_RESPONSES.completion.social_media_post }],
        DEMO_RESPONSES.completion.thread.map(t => ({ post: t })),
      ];
    }
  }
  async extractWebsiteText(content: string) {
    // Demo mode: return sample extracted content
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'extractWebsiteText');
      return this.generatePosts("Demo extracted content: " + content.substring(0, 200));
    }

    try {
      const websiteContent = await openai.chat.completions.create({
        messages: [
          {
            role: 'assistant',
            content:
              'You take a full website text, and extract only the article content',
          },
          {
            role: 'user',
            content,
          },
        ],
        model: 'gpt-4.1',
      });

      const { content: articleContent } = websiteContent.choices[0].message;

      return this.generatePosts(articleContent!);
    } catch (error) {
      this.logger.error(`Website text extraction failed: ${(error as any).message}`);
      return this.generatePosts("Demo extracted content: " + content.substring(0, 200));
    }
  }

  async separatePosts(content: string, len: number) {
    // Demo mode: return sample separated posts
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'separatePosts');
      const demoPosts = DEMO_RESPONSES.posts.map(p => p.post.substring(0, len));
      return { posts: demoPosts };
    }

    try {
      const SeparatePostsPrompt = z.object({
        posts: z.array(z.string()),
      });

      const SeparatePostPrompt = z.object({
        post: z.string().max(len),
      });

      const posts =
        (
          await openai.chat.completions.parse({
            model: 'gpt-4.1',
            messages: [
              {
                role: 'system',
                content: `You are an assistant that take a social media post and break it to a thread, each post must be minimum ${
                  len - 10
                } and maximum ${len} characters, keeping the exact wording and break lines, however make sure you split posts based on context`,
              },
              {
                role: 'user',
                content: content,
              },
            ],
            response_format: zodResponseFormat(
              SeparatePostsPrompt,
              'separatePosts'
            ),
          })
        ).choices[0].message.parsed?.posts || [];

      return {
        posts: await Promise.all(
          posts.map(async (post: any) => {
            if (post.length <= len) {
              return post;
            }

            let retries = 4;
            while (retries) {
              try {
                return (
                  (
                    await openai.chat.completions.parse({
                      model: 'gpt-4.1',
                      messages: [
                        {
                          role: 'system',
                          content: `You are an assistant that take a social media post and shrink it to be maximum ${len} characters, keeping the exact wording and break lines`,
                        },
                        {
                          role: 'user',
                          content: post,
                        },
                      ],
                      response_format: zodResponseFormat(
                        SeparatePostPrompt,
                        'separatePost'
                      ),
                    })
                  ).choices[0].message.parsed?.post || ''
                );
              } catch (e) {
                retries--;
              }
            }

            return post;
          })
        ),
      };
    } catch (error) {
      this.logger.error(`Post separation failed: ${(error as any).message}`);
      const demoPosts = DEMO_RESPONSES.posts.map(p => p.post.substring(0, len));
      return { posts: demoPosts };
    }
  }

  async generateSlidesFromText(text: string) {
    // Demo mode: return sample slides
    if (DEMO_MODE) {
      logDemoModeWarning(this.logger, 'generateSlidesFromText');
      return DEMO_RESPONSES.slides;
    }

    for (let i = 0; i < 3; i++) {
      try {
        const message = `You are an assistant that takes a text and break it into slides, each slide should have an image prompt and voice text to be later used to generate a video and voice, image prompt should capture the essence of the slide and also have a back dark gradient on top, image prompt should not contain text in the picture, generate between 3-5 slides maximum`;
        const parse =
          (
            await openai.chat.completions.parse({
              model: 'gpt-4.1',
              messages: [
                {
                  role: 'system',
                  content: message,
                },
                {
                  role: 'user',
                  content: text,
                },
              ],
              response_format: zodResponseFormat(
                z.object({
                  slides: z
                    .array(
                      z.object({
                        imagePrompt: z.string(),
                        voiceText: z.string(),
                      })
                    )
                    .describe('an array of slides'),
                }),
                'slides'
              ),
            })
          ).choices[0].message.parsed?.slides || [];

        return parse;
      } catch (err) {
        this.logger.error(`Slide generation attempt ${i + 1} failed: ${(err as any).message}`);
      }
    }

    // Return demo slides if all attempts fail
    this.logger.warn('All slide generation attempts failed, returning demo slides');
    return DEMO_RESPONSES.slides;
  }
}
