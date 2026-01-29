import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { OpenAIProviderAdapter } from './openai-provider.adapter';
import { GLMProviderAdapter } from './glm-provider.adapter';
import { ProviderHealthStatus } from '../interfaces/ai-provider.interface';
import { AIProviderType, HEALTH_CHECK_INTERVAL_MS } from '../enums/ai-provider.enum';

/**
 * Provider Health Service
 * Monitors the health and availability of all AI providers
 */
@Injectable()
export class ProviderHealthService implements OnModuleInit {
  private readonly logger = new Logger(ProviderHealthService.name);
  private healthStatus: Map<AIProviderType, ProviderHealthStatus> = new Map();
  private healthCheckInterval: NodeJS.Timeout;

  constructor(
    private readonly openaiProvider: OpenAIProviderAdapter,
    private readonly glmProvider: GLMProviderAdapter,
  ) {
    // Initialize health status
    this.healthStatus.set(AIProviderType.OPENAI, {
      provider: AIProviderType.OPENAI,
      isHealthy: true,
      latencyMs: 0,
      lastChecked: new Date(),
    });

    this.healthStatus.set(AIProviderType.GLM_4_7, {
      provider: AIProviderType.GLM_4_7,
      isHealthy: false, // GLM not yet implemented
      latencyMs: 0,
      lastChecked: new Date(),
    });
  }

  /**
   * Initialize health checks on module init
   */
  async onModuleInit() {
    this.logger.log('Initializing provider health monitoring...');

    // Perform initial health check
    await this.checkAllProviders();

    // Start periodic health checks
    this.startHealthChecks();
  }

  /**
   * Check health of all providers
   */
  async checkAllProviders(): Promise<Map<AIProviderType, ProviderHealthStatus>> {
    await Promise.all([
      this.checkProvider(AIProviderType.OPENAI),
      this.checkProvider(AIProviderType.GLM_4_7),
    ]);

    return this.healthStatus;
  }

  /**
   * Check health of a specific provider
   */
  async checkProvider(provider: AIProviderType): Promise<ProviderHealthStatus> {
    const startTime = Date.now();

    try {
      let isHealthy = false;
      let errorMessage: string | undefined;

      if (provider === AIProviderType.OPENAI) {
        isHealthy = await this.openaiProvider.isHealthy();
      } else if (provider === AIProviderType.GLM_4_7) {
        isHealthy = await this.glmProvider.isHealthy();
      }

      const latencyMs = Date.now() - startTime;

      const status: ProviderHealthStatus = {
        provider,
        isHealthy,
        latencyMs,
        lastChecked: new Date(),
        errorMessage,
      };

      this.healthStatus.set(provider, status);
      return status;
    } catch (error) {
      const latencyMs = Date.now() - startTime;

      const status: ProviderHealthStatus = {
        provider,
        isHealthy: false,
        latencyMs,
        lastChecked: new Date(),
        errorMessage: (error as any).message,
      };

      this.healthStatus.set(provider, status);
      this.logger.error(`Health check failed for ${provider}: ${(error as any).message}`);

      return status;
    }
  }

  /**
   * Get health status of a specific provider
   */
  getProviderHealth(provider: AIProviderType): ProviderHealthStatus | undefined {
    return this.healthStatus.get(provider);
  }

  /**
   * Get all provider health statuses
   */
  getAllProviderHealth(): ProviderHealthStatus[] {
    return Array.from(this.healthStatus.values());
  }

  /**
   * Check if a provider is healthy
   */
  isProviderHealthy(provider: AIProviderType): boolean {
    const status = this.healthStatus.get(provider);
    return status?.isHealthy ?? false;
  }

  /**
   * Get list of healthy providers
   */
  getHealthyProviders(): AIProviderType[] {
    return Array.from(this.healthStatus.entries())
      .filter(([_, status]) => status.isHealthy)
      .map(([provider, _]) => provider);
  }

  /**
   * Get the fastest healthy provider
   */
  getFastestHealthyProvider(): AIProviderType | null {
    const healthyProviders = Array.from(this.healthStatus.entries())
      .filter(([_, status]) => status.isHealthy)
      .sort((a, b) => a[1].latencyMs - b[1].latencyMs);

    return healthyProviders.length > 0 ? healthyProviders[0][0] : null;
  }

  /**
   * Start periodic health checks
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(async () => {
      try {
        await this.checkAllProviders();
        this.logger.debug('Health check completed for all providers');
      } catch (error) {
        this.logger.error(`Health check error: ${(error as any).message}`);
      }
    }, HEALTH_CHECK_INTERVAL_MS);

    this.logger.log(
      `Health checks started (interval: ${HEALTH_CHECK_INTERVAL_MS / 1000}s)`,
    );
  }

  /**
   * Stop periodic health checks
   */
  stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.logger.log('Health checks stopped');
    }
  }

  /**
   * Get overall system health
   */
  getSystemHealth(): {
    healthy: boolean;
    availableProviders: number;
    totalProviders: number;
    providers: ProviderHealthStatus[];
  } {
    const providers = this.getAllProviderHealth();
    const availableProviders = providers.filter((p) => p.isHealthy).length;
    const totalProviders = providers.length;

    return {
      healthy: availableProviders > 0,
      availableProviders,
      totalProviders,
      providers,
    };
  }

  /**
   * Cleanup on module destroy
   */
  onModuleDestroy() {
    this.stopHealthChecks();
  }
}
