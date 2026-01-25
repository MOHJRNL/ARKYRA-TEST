import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * AI Provider Types
 * Supported LLM providers for ARKYRA
 */
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE_GEMINI = 'google-gemini',
  GROQ = 'groq',
  MISTRAL = 'mistral',
}

/**
 * AI Model Configuration
 * Maps providers to their recommended models for different tasks
 */
export const AI_MODELS = {
  [AIProvider.OPENAI]: {
    chat: 'gpt-4.1',          // Best for general chat and content generation
    chatFast: 'gpt-4.1-mini',  // Faster, cheaper alternative
    vision: 'gpt-4.1',         // For image understanding
    image: 'dall-e-3',         // For image generation
  },
  [AIProvider.ANTHROPIC]: {
    chat: 'claude-3-7-sonnet-20250219',     // Best for complex reasoning
    chatFast: 'claude-3-5-haiku-20241022',  // Faster alternative
    vision: 'claude-3-7-sonnet-20250219',   // For image understanding
  },
  [AIProvider.GOOGLE_GEMINI]: {
    chat: 'gemini-2.0-flash-exp',      // Best for general tasks
    chatFast: 'gemini-2.0-flash-exp',  // Same model, fast by default
    vision: 'gemini-2.0-flash-exp',    // Multimodal support
    image: 'imagen-3.0-generate-001',  // For image generation
  },
  [AIProvider.GROQ]: {
    chat: 'llama-3.3-70b-versatile',   // Best for general tasks
    chatFast: 'llama-3.1-8b-instant',  // Fastest option
  },
  [AIProvider.MISTRAL]: {
    chat: 'mistral-large-latest',      // Best for complex tasks
    chatFast: 'mistral-small-latest',  // Faster alternative
  },
};

/**
 * AI Provider Interface
 * Common interface for all AI providers
 */
export interface IAIProvider {
  generateText(prompt: string, systemPrompt?: string): Promise<string>;
  generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null>;
  generateImage?(prompt: string, options?: any): Promise<string>;
}

/**
 * OpenAI Provider Implementation
 */
class OpenAIProvider implements IAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null> {
    const response = await this.client.chat.completions.parse({
      model: this.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
      response_format: schema,
    });

    return response.choices[0]?.message?.parsed as T;
  }

  async generateImage(prompt: string, options: any = {}): Promise<string> {
    const response = await this.client.images.generate({
      prompt,
      model: AI_MODELS[AIProvider.OPENAI].image,
      response_format: 'url',
      ...options,
    });

    return response.data[0]?.url || '';
  }
}

/**
 * Anthropic Provider Implementation
 */
class AnthropicProvider implements IAIProvider {
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      ...(systemPrompt ? { system: systemPrompt } : {}),
      messages: [{ role: 'user', content: prompt }],
    });

    const content = response.content[0];
    return content.type === 'text' ? content.text : '';
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null> {
    const schemaPrompt = `${prompt}\n\nPlease respond in the following JSON format: ${JSON.stringify(schema)}`;
    const response = await this.generateText(schemaPrompt, systemPrompt);

    try {
      return JSON.parse(response) as T;
    } catch {
      return null;
    }
  }
}

/**
 * Google Gemini Provider Implementation
 */
class GoogleGeminiProvider implements IAIProvider {
  private client: GoogleGenerativeAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new GoogleGenerativeAI(apiKey);
    this.model = model;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const model = this.client.getGenerativeModel({ model: this.model });
    const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;

    const result = await model.generateContent(fullPrompt);
    return result.response.text();
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null> {
    const schemaPrompt = `${prompt}\n\nPlease respond in the following JSON format: ${JSON.stringify(schema)}`;
    const response = await this.generateText(schemaPrompt, systemPrompt);

    try {
      // Remove markdown code blocks if present
      const cleaned = response.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      return JSON.parse(cleaned) as T;
    } catch {
      return null;
    }
  }

  async generateImage(prompt: string): Promise<string> {
    // Gemini image generation would go here
    // Currently using Imagen API
    throw new Error('Image generation not yet implemented for Gemini');
  }
}

/**
 * Groq Provider Implementation (OpenAI-compatible API)
 */
class GroqProvider implements IAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });
    this.model = model;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null> {
    const schemaPrompt = `${prompt}\n\nPlease respond in the following JSON format: ${JSON.stringify(schema)}`;
    const response = await this.generateText(schemaPrompt, systemPrompt);

    try {
      return JSON.parse(response) as T;
    } catch {
      return null;
    }
  }
}

/**
 * Mistral Provider Implementation (OpenAI-compatible API)
 */
class MistralProvider implements IAIProvider {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.mistral.ai/v1',
    });
    this.model = model;
  }

  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        ...(systemPrompt ? [{ role: 'system' as const, content: systemPrompt }] : []),
        { role: 'user' as const, content: prompt },
      ],
    });

    return response.choices[0]?.message?.content || '';
  }

  async generateStructuredOutput<T>(
    prompt: string,
    schema: any,
    systemPrompt?: string
  ): Promise<T | null> {
    const schemaPrompt = `${prompt}\n\nPlease respond in the following JSON format: ${JSON.stringify(schema)}`;
    const response = await this.generateText(schemaPrompt, systemPrompt);

    try {
      return JSON.parse(response) as T;
    } catch {
      return null;
    }
  }
}

/**
 * AI Provider Factory Service
 * Creates and manages AI provider instances
 */
@Injectable()
export class AIProviderService {
  private providers: Map<AIProvider, IAIProvider> = new Map();

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize OpenAI
    if (process.env.OPENAI_API_KEY) {
      this.providers.set(
        AIProvider.OPENAI,
        new OpenAIProvider(
          process.env.OPENAI_API_KEY,
          AI_MODELS[AIProvider.OPENAI].chat
        )
      );
    }

    // Initialize Anthropic
    if (process.env.ANTHROPIC_API_KEY) {
      this.providers.set(
        AIProvider.ANTHROPIC,
        new AnthropicProvider(
          process.env.ANTHROPIC_API_KEY,
          AI_MODELS[AIProvider.ANTHROPIC].chat
        )
      );
    }

    // Initialize Google Gemini
    if (process.env.GOOGLE_GEMINI_API_KEY) {
      this.providers.set(
        AIProvider.GOOGLE_GEMINI,
        new GoogleGeminiProvider(
          process.env.GOOGLE_GEMINI_API_KEY,
          AI_MODELS[AIProvider.GOOGLE_GEMINI].chat
        )
      );
    }

    // Initialize Groq
    if (process.env.GROQ_API_KEY) {
      this.providers.set(
        AIProvider.GROQ,
        new GroqProvider(
          process.env.GROQ_API_KEY,
          AI_MODELS[AIProvider.GROQ].chat
        )
      );
    }

    // Initialize Mistral
    if (process.env.MISTRAL_API_KEY) {
      this.providers.set(
        AIProvider.MISTRAL,
        new MistralProvider(
          process.env.MISTRAL_API_KEY,
          AI_MODELS[AIProvider.MISTRAL].chat
        )
      );
    }
  }

  /**
   * Get the default AI provider based on environment configuration
   */
  getDefaultProvider(): IAIProvider {
    const defaultProviderName =
      (process.env.AI_PROVIDER as AIProvider) || AIProvider.GOOGLE_GEMINI;

    const provider = this.providers.get(defaultProviderName);
    if (!provider) {
      throw new Error(
        `AI Provider ${defaultProviderName} is not configured. Please set the appropriate API key.`
      );
    }

    return provider;
  }

  /**
   * Get a specific AI provider
   */
  getProvider(providerName: AIProvider): IAIProvider {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(
        `AI Provider ${providerName} is not configured. Please set the appropriate API key.`
      );
    }

    return provider;
  }

  /**
   * Get all available providers
   */
  getAvailableProviders(): AIProvider[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if a provider is available
   */
  isProviderAvailable(providerName: AIProvider): boolean {
    return this.providers.has(providerName);
  }
}
