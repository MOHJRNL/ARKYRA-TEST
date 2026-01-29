import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

// Services
import { AIRouterService } from './services/ai-router.service';
import { AIRouterDecisionService } from './services/ai-router-decision.service';
import { AIRouterFallbackService } from './services/ai-router-fallback.service';
import { UsageTrackingService } from './services/usage-tracking.service';
import { QuotaManagementService } from './services/quota-management.service';
import { ProviderMetricsService } from './services/provider-metrics.service';

// Providers
import { OpenAIProviderAdapter } from './providers/openai-provider.adapter';
import { GLMProviderAdapter } from './providers/glm-provider.adapter';
import { ProviderHealthService } from './providers/provider-health.service';

// Repositories
import { UsageTrackingRepository } from './repositories/usage-tracking.repository';
import { QuotaRepository } from './repositories/quota.repository';
import { ProviderMetricsRepository } from './repositories/provider-metrics.repository';

// Dependencies
import { DatabaseModule } from '../database/prisma/database.module';
import { OpenaiService } from '../openai/openai.service';
import { Logger } from '@nestjs/common';

/**
 * AI Router Module
 *
 * Provides hybrid AI provider routing with:
 * - Automatic provider selection (OpenAI + GLM-4.7)
 * - Quota management and enforcement
 * - Usage tracking and analytics
 * - Fallback handling
 * - Performance metrics
 * - Demo mode support (works without API keys)
 *
 * @example
 * ```typescript
 * @Module({
 *   imports: [AIRouterModule],
 *   // Your module code
 * })
 * export class AppModule {}
 * ```
 */
@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(), // For cron jobs
  ],
  providers: [
    // Core Services
    AIRouterService,
    AIRouterDecisionService,
    AIRouterFallbackService,
    UsageTrackingService,
    QuotaManagementService,
    ProviderMetricsService,

    // Provider Adapters (work in demo mode without API keys)
    OpenAIProviderAdapter,
    GLMProviderAdapter,
    ProviderHealthService,

    // Repositories
    UsageTrackingRepository,
    QuotaRepository,
    ProviderMetricsRepository,

    // Dependencies (work in demo mode)
    OpenaiService,
  ],
  exports: [
    // Export main services for use in other modules
    AIRouterService,
    UsageTrackingService,
    QuotaManagementService,
    ProviderHealthService,

    // Export adapters if direct access is needed
    OpenAIProviderAdapter,
    GLMProviderAdapter,
  ],
})
export class AIRouterModule {}
